from typing import TYPE_CHECKING

from app.db import DB
from psycopg.rows import DictRow
from psycopg.sql import SQL, Identifier
from pydantic import (
    BaseModel,
    Field,
    NonNegativeInt,
    PositiveInt,
    ValidationError,
    conlist,
)

if TYPE_CHECKING:
    from pydantic.error_wrappers import ErrorDict


def fetch_sql() -> SQL:
    return SQL(
        """
    SELECT table_name, columns
    FROM (
        SELECT t.table_name, json_agg(json_build_object('name', c.column_name, 'data_type', c.data_type) ORDER  BY c.column_name) AS columns
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c
        ON t.table_name = c.table_name
        WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
        GROUP BY t.table_name
        ORDER BY t.table_name ASC
        LIMIT %(limit)s
        OFFSET %(offset)s
    ) AS tables
    WHERE tables.table_name=(%(name)s) OR %(name)s = ''
    """
    )


class TableCreateColumn(BaseModel):
    name: str
    data_type: str


class TableCreateRequest(BaseModel):
    table_name: str
    columns: conlist(item_type=TableCreateColumn, min_items=1)  # type: ignore
    create_id: bool = Field(default=False)


class TableUpdateRequest(BaseModel):
    table_name: str
    action: str
    remaining_sql: str


class QueryParams(BaseModel):
    limit: PositiveInt = Field(default=10)
    offset: NonNegativeInt = Field(default=0)


class Table:
    @staticmethod
    def all(query: dict | None = None) -> list[DictRow]:
        params = QueryParams(**(query or {}))
        return DB().fetch_all(fetch_sql(), {"name": "", **params.dict()})

    @staticmethod
    def find(table_name: str) -> DictRow | None:
        params = QueryParams()
        return DB().fetch_one(fetch_sql(), {"name": table_name, **params.dict()})

    @staticmethod
    def drop(table_name: str) -> None:
        DB().execute(SQL("DROP TABLE {}").format(Identifier(table_name)))

    def __init__(self, request_dict: dict | None, is_update_request=False) -> None:
        self.request_dict = request_dict or {}
        self._is_update_request = is_update_request
        self._errors: list["ErrorDict"] = []

        self.validate()

    def validate(self):
        try:
            if self._is_update_request:
                self.request = TableUpdateRequest(**self.request_dict)
            else:
                self.request = TableCreateRequest(**self.request_dict)
        except ValidationError as e:
            self._errors = e.errors()

    def create(self) -> DictRow | None:
        if self.valid and isinstance(self.request, TableCreateRequest):
            id_sql = SQL("id serial PRIMARY KEY")
            columns_sql = SQL(", ").join(
                SQL("{} {}").format(Identifier(col["name"]), SQL(col["data_type"]))
                for col in self.request_dict["columns"]
            )

            if self.request.create_id:
                columns_sql = SQL(", ").join([id_sql, columns_sql])

            sql = SQL("CREATE TABLE {} ({})").format(
                Identifier(self.request.table_name),
                columns_sql,
            )

            DB().execute(sql)
            return Table.find(self.request.table_name)

        return None

    def update(self) -> bool:
        if self.valid:
            action = self.request_dict["action"]
            remaining_sql = self.request_dict["remaining_sql"]
            base_sql_str = "ALTER TABLE {name} {action} {remaining_sql}"

            sql = SQL(base_sql_str).format(
                name=Identifier(self.request.table_name),
                action=SQL(action),
                remaining_sql=SQL(remaining_sql),
            )

            DB().execute(sql)
            return True

        return False

    @property
    def valid(self) -> bool:
        return len(self._errors) == 0

    @property
    def errors(self) -> tuple["ErrorDict", ...]:
        return tuple(self._errors)
