from typing import TypedDict

from app.db import DB
from psycopg.rows import DictRow
from psycopg.sql import SQL, Identifier
from pydantic import BaseModel, Field, NonNegativeInt, PositiveInt, conlist


def fetch_sql() -> SQL:
    return SQL(
        """
SELECT t.table_name,
    json_agg(
        json_build_object(
            'name', c.column_name,
            'data_type', c.data_type
        ) ORDER BY c.column_name
    ) AS columns,
    MAX(
        CASE WHEN tc.constraint_type = 'PRIMARY KEY'
        THEN c.column_name
        ELSE '' END
    ) AS primary_key
    FROM information_schema.tables t
        LEFT JOIN information_schema.columns c
            ON t.table_name = c.table_name
        LEFT JOIN information_schema.key_column_usage kcu
            ON t.table_name = kcu.table_name
            AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc
            ON kcu.table_name = tc.table_name
            AND kcu.constraint_name = tc.constraint_name
            AND tc.constraint_type = 'PRIMARY KEY'
    WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
        AND (t.table_name=(%(name)s) OR %(name)s = '')
    GROUP BY t.table_name
    ORDER BY t.table_name ASC
    LIMIT %(limit)s
    OFFSET %(offset)s
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


class GetReturnData(TypedDict):
    tables: list[DictRow]
    limit: int
    offset: int


def get_tables(query_params: QueryParams) -> GetReturnData:
    res = DB().fetch_all(fetch_sql(), {"name": "", **query_params.dict()})
    return {
        "tables": res,
        "limit": query_params.limit,
        "offset": query_params.offset,
    }


def find_table(table_name: str) -> DictRow | None:
    params = QueryParams()
    return DB().fetch_one(fetch_sql(), {"name": table_name, **params.dict()})


def create_table(request: TableCreateRequest) -> DictRow | None:
    if isinstance(request, TableUpdateRequest):
        raise ValueError("Use TableCreateRequest, not TableUpdateRequest")

    id_sql = SQL("id serial PRIMARY KEY")
    columns_sql = SQL(", ").join(
        SQL("{} {}").format(Identifier(col.name), SQL(col.data_type))
        for col in request.columns
    )

    if request.create_id:
        columns_sql = SQL(", ").join([id_sql, columns_sql])

    sql = SQL("CREATE TABLE {} ({})").format(
        Identifier(request.table_name),
        columns_sql,
    )

    DB().execute(sql)
    return find_table(request.table_name)


def update_table(request: TableUpdateRequest) -> bool:
    sql = SQL("ALTER TABLE {} {} {}").format(
        Identifier(request.table_name),
        SQL(request.action),  # type: ignore
        SQL(request.remaining_sql),  # type: ignore
    )

    DB().execute(sql)
    return True


def drop_table(table_name: str) -> None:
    DB().execute(SQL("DROP TABLE {}").format(Identifier(table_name)))
