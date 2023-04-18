from typing import TYPE_CHECKING

from app.db import DB
from psycopg.rows import DictRow
from psycopg.sql import SQL, Identifier, Placeholder
from pydantic import (
    BaseModel,
    Field,
    NonNegativeInt,
    PositiveInt,
    ValidationError,
    validator,
)

if TYPE_CHECKING:
    from pydantic.error_wrappers import ErrorDict

SELECT_TABLE_COLUMNS_SQL = SQL(
    """
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = %s;
    """
)

SELECT_ROWS_SQL = SQL(
    """
    SELECT * FROM {name}
    {order_by_clause}
    LIMIT {limit}
    OFFSET {offset}
    """
)

FIND_ROW_SQL = SQL("SELECT * FROM {table_name} WHERE id = {id}")

INSERT_ROWS_SQL = SQL(
    "INSERT INTO {table_name} ({columns}) VALUES ({values}) RETURNING *"
)

UPDATE_ROW_SQL = SQL("UPDATE {table_name} SET {columns} WHERE id = {id} RETURNING *")

DELETE_ROW_SQL = SQL("DELETE FROM {table_name} WHERE id = {id} RETURNING id")


class QueryParams(BaseModel):
    order_by: str | None
    limit: PositiveInt | None = Field(default=20)
    offset: NonNegativeInt = Field(default=0)

    @validator("limit")
    def set_limit(cls, v):
        return v if v else 20


class Row:
    def __init__(
        self,
        table_name: str,
        id: str | None = None,
        request_dict: dict | None = None,
        query_params_dict=None,
    ) -> None:
        self.id = id
        self.request_dict = request_dict
        self.request_keys = tuple(request_dict.keys() if request_dict else [])
        self.request_values = tuple(request_dict.values() if request_dict else [])
        self.query_params_dict = query_params_dict
        self.table_name = table_name
        self._errors: list["ErrorDict"] = []

        self._validate()  # self.query_params set here

    def all(self) -> list[DictRow] | None:
        if not self.valid:
            return None

        order_by_clause = (
            SQL("ORDER BY {}").format(Identifier(self.query_params.order_by))
            if self.query_params.order_by
            else SQL("")
        )
        sql = SELECT_ROWS_SQL.format(
            name=Identifier(self.table_name),
            name_str=self.table_name,
            limit=self.query_params.limit,
            offset=self.query_params.offset,
            order_by_clause=order_by_clause,
        )

        return DB().fetch_all(sql)

    def find(self) -> DictRow | None:
        if not self._is_valid_id(self.id):
            return None

        sql = FIND_ROW_SQL.format(
            table_name=Identifier(self.table_name),
            id=self.id,
        )
        res = DB().fetch_one(sql)

        self._is_valid_id(res)
        return res

    def create(self) -> DictRow | None:
        if not self.valid:
            return None

        columns = [Identifier(col) for col in self.request_keys]

        sql = INSERT_ROWS_SQL.format(
            table_name=Identifier(self.table_name),
            columns=SQL(", ").join(columns),
            values=SQL(", ").join(self.request_values),
        )
        return DB().fetch_one(sql)

    def update(self) -> DictRow | None:
        if not self.valid or not self._is_valid_id(self.id):
            return None

        columns = [
            SQL("{} = {}").format(Identifier(col), Placeholder())
            for col in self.request_keys
        ]

        sql = UPDATE_ROW_SQL.format(
            table_name=Identifier(self.table_name),
            columns=SQL(", ").join(columns),
            id=self.id,
        )
        res = DB().fetch_one(sql, self.request_values)

        self._is_valid_id(res)
        return res

    def delete(self) -> DictRow | None:
        if not self._is_valid_id(self.id):
            return None

        sql = DELETE_ROW_SQL.format(
            table_name=Identifier(self.table_name),
            id=self.id,
        )
        res = DB().fetch_one(sql)

        self._is_valid_id(res)
        return res

    @property
    def valid(self) -> bool:
        return len(self._errors) == 0

    @property
    def errors(self) -> tuple["ErrorDict", ...]:
        return tuple(self._errors)

    def _validate(self) -> None:
        if not self.table_name:
            self._add_error(("table_name",), "field required")

        try:
            self.query_params = QueryParams(**self.query_params_dict or {})
        except ValidationError as e:
            self._errors = e.errors()

        if self.request_dict is not None:
            self._validate_column_names()

    def _validate_column_names(self) -> bool:
        if not self.request_dict:
            self._add_error(
                ("column",),
                "column information is required",
            )
            return False

        # Is this check necessary since we're just passing all Postges errors back
        # to the client anyways? Is security improved?
        allowed_columns = {
            row["column_name"]
            for row in DB().fetch_all(SELECT_TABLE_COLUMNS_SQL, (self.table_name,))
        }

        input_columns: set[str] = set(self.request_keys)
        extra_columns = input_columns.difference(allowed_columns)

        if extra_columns:
            self._add_error(
                tuple(sorted(extra_columns)),
                f'Invalid columns for table "{self.table_name}"',
                "value_error.invalid",
            )
            return False

        return True

    def _is_valid_id(self, id_or_res: str | DictRow | None) -> bool:
        if not id_or_res:
            self._add_error(("id",), "Invalid id", "value_error.invalid")
            return False
        return True

    def _add_error(
        self, loc: tuple[str, ...], msg: str, errorType: str = "value_error.missing"
    ):
        self._errors.append(
            {
                "loc": loc,
                "msg": msg,
                "type": errorType,
            }
        )
