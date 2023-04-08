from typing import Callable

import pytest
from app.create_app import create_app
from app.db import DB
from flask import Flask
from flask.testing import FlaskClient
from mypy_extensions import Arg


@pytest.fixture
def app_factory(request: pytest.FixtureRequest) -> Callable[[Arg(str, "sql")], Flask]:
    def factory(sql: str | None = None) -> Flask:
        app = create_app(testing=True)
        db = DB(app)

        if sql:
            db.execute(sql)

        def teardown():
            db.drop_all_tables()

        request.addfinalizer(teardown)
        return app

    return factory


@pytest.fixture
def client_factory(
    request: pytest.FixtureRequest,
) -> Callable[[Arg(str, "sql")], FlaskClient]:
    def factory(sql: str | None = None) -> FlaskClient:
        app = create_app(testing=True)
        db = DB(app)

        if sql:
            db.execute(sql)

        def teardown():
            db.drop_all_tables()

        request.addfinalizer(teardown)
        return app.test_client()

    return factory
