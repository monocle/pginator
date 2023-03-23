from typing import List
from dotenv import dotenv_values
import psycopg as pg
from psycopg.rows import dict_row, DictRow
from psycopg.sql import SQL, Identifier
from psycopg.abc import Query


class Postgres:
    app_db_names = {"development", "test"}
    db_prefix = "postgres"
    user: str
    password: str
    host: str
    port: str

    def __init__(self, env_vars=None):
        if env_vars is None:
            env_vars = dotenv_values(".env")

        for attr in ["user", "password", "host", "port"]:
            env_var_name = (self.db_prefix + "_" + attr).upper()
            value = env_vars.get(env_var_name)

            if not value:
                exit("Missing environment variable: " + env_var_name)

            setattr(self, attr, value)

    def connect(self, autocommit=False):
        return pg.connect(
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port,
            autocommit=autocommit,
        )

    def fetch_all(self, sql: Query) -> List[DictRow]:
        with self.connect() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                return cursor.execute(sql).fetchall()

    def fetch_all_databases(self) -> List[DictRow]:
        sql = """SELECT *
                 FROM pg_database
                 WHERE datistemplate = false
                 ORDER BY datname ASC"""
        return self.fetch_all(sql)

    def create_database(self, name: str):
        self._transact_database(SQL("CREATE DATABASE {}"), name)

    def drop_database(self, name: str):
        self._transact_database(SQL("DROP DATABASE {}"), name)

    @property
    def database_names(self):
        return {db["datname"] for db in self.fetch_all_databases()}

    def _transact_database(self, sql: SQL, db_name: str):
        conn = self.connect(autocommit=True)
        conn.execute(sql.format(Identifier(db_name))).close()
