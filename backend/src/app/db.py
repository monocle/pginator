from typing import List, Optional

import psycopg as pg
from flask import Flask, current_app
from psycopg.abc import Params, Query
from psycopg.connection import Connection
from psycopg.cursor import Cursor
from psycopg.rows import DictRow, TupleRow, dict_row


class DB:
    def __init__(self, app: Optional[Flask] = None):
        _app = app if app else current_app
        self.uri = _app.config["DB_URI"]

    def connect(self) -> Connection[TupleRow]:
        return pg.connect(self.uri)

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

        with self.connect() as conn:
            with conn.cursor() as cursor:
                for statement in cursor.execute(sql):
                    cursor.execute(statement[0])
