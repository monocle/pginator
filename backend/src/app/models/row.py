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
    ORDER BY (
        SELECT column_name
        FROM information_schema.constraint_column_usage
        WHERE table_name = {name_str}
        AND constraint_name IN (
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = {name_str}
            AND constraint_type = 'PRIMARY KEY'
        )
    )
    LIMIT {limit}
    OFFSET {offset}
    """
)

INSERT_ROWS_SQL = SQL(
    "INSERT INTO {table_name} ({columns}) VALUES ({values}) RETURNING *"
)


class QueryParams(BaseModel):
    limit: PositiveInt | None = Field(default=20)
    offset: NonNegativeInt = Field(default=0)

    @validator("limit")
    def set_limit(cls, v):
        return v if v else 20


class Row:
    def __init__(
        self, table_name: str, request_dict: dict | None = None, params_dict=None
    ) -> None:
        self.request_dict = request_dict
        self.params_dict = params_dict
        self.table_name = table_name
        self._errors: list["ErrorDict"] = []

        self.validate()

    def validate(self) -> None:
        if not self.table_name:
            self._add_error(("table_name",), "field required")
        try:
            self.params = QueryParams(**self.params_dict or {})
        except ValidationError as e:
            self._errors = e.errors()

    def all(self) -> list[DictRow] | None:
        if not self.valid:
            return None

        sql = SELECT_ROWS_SQL.format(
            name=Identifier(self.table_name),
            name_str=self.table_name,
            limit=self.params.limit,
            offset=self.params.offset,
        )
        return DB().fetch_all(sql)

    def create(self) -> DictRow | None:
        # The seecond check is for type checker.
        if not self._valid_column_names() or not self.request_dict:
            return None

        columns = [Identifier(col) for col in self.request_dict.keys()]
        placeholders = [Placeholder() for _ in self.request_dict.keys()]
        values = tuple(self.request_dict.values())

        sql = INSERT_ROWS_SQL.format(
            table_name=Identifier(self.table_name),
            columns=SQL(", ").join(columns),
            values=SQL(", ").join(values),  # TODO is this necessary?
        )

        return DB().fetch_one(sql)

    @property
    def valid(self) -> bool:
        return len(self._errors) == 0

    @property
    def errors(self) -> tuple["ErrorDict", ...]:
        return tuple(self._errors)

    def _valid_column_names(self) -> bool:
        if not self.request_dict:
            self._add_error(
                ("column",),
                "column information is required",
            )
            return False

        allowed_columns = {
            row["column_name"]
            for row in DB().fetch_all(SELECT_TABLE_COLUMNS_SQL, (self.table_name,))
        }

        input_columns: set[str] = set(self.request_dict.keys())
        extra_columns = input_columns.difference(allowed_columns)

        if extra_columns:
            self._add_error(
                tuple(sorted(extra_columns)),
                f'Invalid columns for table "{self.table_name}"',
                "value_error.invalid",
            )
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
