from app.db import DB
from psycopg.rows import DictRow
from psycopg.sql import SQL, Identifier
from pydantic import BaseModel, ValidationError, conlist


def fetch_sql() -> str:
    return """
    SELECT table_name, columns
    FROM (
        SELECT t.table_name, json_agg(json_build_object('name', c.column_name, 'data_type', c.data_type) ORDER  BY c.column_name) AS columns
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c
        ON t.table_name = c.table_name
        WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
        GROUP BY t.table_name
    ) AS tables
    WHERE tables.table_name=(%(name)s) OR %(name)s = ''
    """


class TableCreateColumn(BaseModel):
    name: str
    data_type: str


class TableCreateRequest(BaseModel):
    table_name: str
    columns: conlist(item_type=TableCreateColumn, min_items=1)  # type: ignore


class TableUpdateRequest(BaseModel):
    table_name: str
    action: str
    remaining_sql: str


class Table:
    @staticmethod
    def all() -> list[DictRow]:
        return DB().fetch_all(fetch_sql(), {"name": ""})

    @staticmethod
    def find(table_name: str) -> DictRow | None:
        return DB().fetch_one(fetch_sql(), {"name": table_name})

    @staticmethod
    def drop(table_name: str) -> None:
        DB().execute(SQL("DROP TABLE {}").format(Identifier(table_name)))

    def __init__(self, request_dict, is_update_request=False):
        self.request_dict = request_dict
        self.name = request_dict.get("table_name")
        self.action = request_dict.get("action")
        self._is_update_request = is_update_request
        self._errors = []

        try:
            if is_update_request:
                self.request = TableUpdateRequest(**request_dict)
            else:
                self.request = TableCreateRequest(**request_dict)
        except ValidationError as e:
            self._errors = e.errors()

    def create(self) -> DictRow | None:
        if self.valid:
            columns = self.request_dict["columns"]
            columns_sql = SQL(", ").join(
                SQL("{} {}").format(Identifier(col["name"]), SQL(col["data_type"]))
                for col in columns
            )
            sql = SQL("CREATE TABLE {} ({})").format(Identifier(self.name), columns_sql)

            DB().execute(sql)
            return Table.find(self.name)

        return None

    def update(self) -> bool:
        if self.valid:
            action = self.request_dict["action"]
            remaining_sql = self.request_dict["remaining_sql"]
            base_sql_str = "ALTER TABLE {name} {action} {remaining_sql}"

            sql = SQL(base_sql_str).format(
                name=Identifier(self.name),
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
    def errors(self) -> tuple[str, ...]:
        return tuple(self._errors)