from typing import TYPE_CHECKING

from app.db import DB
from psycopg.sql import SQL, Identifier
from pydantic import BaseModel, Field, NonNegativeInt, PositiveInt, ValidationError

if TYPE_CHECKING:
    from pydantic.error_wrappers import ErrorDict

DB_ROW_ACTIONS = ("SELECT", "INSERT", "UPDATE", "DELETE")


def primary_key_sql():
    return """
    SELECT column_name
    FROM information_schema.constraint_column_usage
    WHERE table_name = {}
    AND constraint_name IN (
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = {}
        AND constraint_type = 'PRIMARY KEY'
    )
    """


class QueryParams(BaseModel):
    limit: PositiveInt = Field(default=20)
    offset: NonNegativeInt = Field(default=0)


class Rows:
    def __init__(self, table_name: str, params_dict=None) -> None:
        self.params_dict = params_dict
        self.table_name = table_name
        self._errors: list["ErrorDict"] = []

        self.validate()

    def validate(self) -> None:
        if not self.table_name:
            error: "ErrorDict" = {
                "loc": ("table_name",),
                "msg": "field required",
                "type": "value_error.missing",
            }
            self._errors.append(error)
        try:
            self.params = QueryParams(**self.params_dict or {})
        except ValidationError as e:
            self._errors = e.errors()

    def all(self):
        sql = SQL(
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
            """
        ).format(name=Identifier(self.table_name), name_str=self.table_name)
        return DB().fetch_all(sql)

    @property
    def valid(self) -> bool:
        return len(self._errors) == 0

    @property
    def errors(self) -> tuple["ErrorDict", ...]:
        return tuple(self._errors)
