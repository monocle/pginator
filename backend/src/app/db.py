from contextlib import _GeneratorContextManager
from typing import Any, List, Optional

from flask import Flask, current_app
from psycopg.abc import Params, Query
from psycopg.connection import Connection
from psycopg.cursor import Cursor
from psycopg.rows import DictRow, dict_row
from psycopg_pool import ConnectionPool


class DB:
    def __init__(self, app: Optional[Flask] = None):
        _app = app if app else current_app
        self.uri = _app.config["DB_URI"]
        self.connection_pool = ConnectionPool(self.uri)

    def connect(self) -> _GeneratorContextManager[Connection[Any]]:
        return self.connection_pool.connection()

    def execute(self, sql: Query, params: Params | None = None) -> Cursor[DictRow]:
        with self.connect() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                return cursor.execute(sql, params)

    def fetch_all(self, sql: Query, params: Params | None = None) -> List[DictRow]:
        with self.connect() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                return cursor.execute(sql, params).fetchall()

    def fetch_one(self, sql: Query, params: Params | None = None) -> Optional[DictRow]:
        with self.connect() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                return cursor.execute(sql, params).fetchone()

    def drop_all_tables(self) -> None:
        sql = """SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;' FROM pg_tables WHERE schemaname = 'public';"""
        statements = []

        with self.connect() as conn:
            statements = conn.execute(sql).fetchall()

        with self.connect() as conn:
            for statement in statements:
                conn.execute(statement[0])
