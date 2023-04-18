from typing import Callable, Iterator

import pytest
from app.create_app import create_app
from app.db import DB
from flask import Flask
from flask.testing import FlaskClient
from mypy_extensions import Arg
from psycopg.sql import SQL

AppFactory = Callable[[Arg(str, "sql")], Flask]
ClientFactory = Callable[[Arg(str, "sql")], FlaskClient]


@pytest.fixture
def app_factory(request: pytest.FixtureRequest) -> AppFactory:
    def factory(sql: str | None = None) -> Flask:
        app = create_app(testing=True)
        db = DB(app)

        if sql:
            db.execute(sql)  # type: ignore

        def teardown():
            db.drop_all_tables()

        request.addfinalizer(teardown)
        return app

    return factory


@pytest.fixture
def client_factory(
    request: pytest.FixtureRequest,
) -> ClientFactory:
    def factory(sql: str | None = None) -> FlaskClient:
        app = create_app(testing=True)
        db = DB(app)

        if sql:
            db.execute(sql)  # type: ignore

        def teardown():
            db.drop_all_tables()

        request.addfinalizer(teardown)
        return app.test_client()

    return factory


def users_sql():
    table_name = "users"
    num_rows = 21
    values = ", ".join(
        [f"('first_name{i}', 'last_name{i}')" for i in range(0, num_rows)]
    )
    return f"""
        CREATE TABLE {table_name} (id serial PRIMARY KEY, first_name text, last_name text);
        INSERT INTO {table_name} (first_name, last_name)
            VALUES {values}
        """


@pytest.fixture
def app_with_users(app_factory: AppFactory) -> Iterator:
    app = app_factory(users_sql())
    with app.app_context():
        yield


@pytest.fixture
def client_with_users(client_factory) -> FlaskClient:
    return client_factory(users_sql())
