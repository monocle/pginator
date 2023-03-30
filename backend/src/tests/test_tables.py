from contextlib import contextmanager
from typing import Callable, ContextManager, Iterator

import pytest
from app.create_app import create_app
from app.db import DB
from flask.testing import FlaskClient
from mypy_extensions import Arg
from psycopg.sql import SQL, Identifier

TABLE_NAME = "foo"

ClientFactory = Callable[[Arg(bool, "init_db")], ContextManager]


@pytest.fixture
def client_factory() -> ClientFactory:
    @contextmanager
    def factory(init_db=False) -> Iterator[FlaskClient]:
        app = create_app(testing=True)
        db = DB(app)

        if init_db:
            sql = "CREATE TABLE {} (id serial PRIMARY KEY, num integer, address text)"
            db.execute(SQL(sql).format(Identifier(TABLE_NAME)))

        client = app.test_client()
        try:
            yield client
        finally:
            db.drop_all_tables()

    return factory


FOO_TABLE_RESPONSE_JSON = {
    "columns": [
        {"name": "address", "data_type": "text"},
        {"name": "id", "data_type": "integer"},
        {"name": "num", "data_type": "integer"},
    ],
    "table_name": "foo",
}


@pytest.mark.parametrize(
    "init_db, path, expected_status_code, res_data_attr, expected_value",
    [
        (False, "/tables/", 200, "tables", []),
        (True, "/tables/", 200, "tables", [FOO_TABLE_RESPONSE_JSON]),
        (False, "/tables/foo", 404, "error", "Table 'foo' does not exist"),
        (True, "/tables/foo", 200, "table_name", "foo"),
    ],
)
def test_get_endpoints(
    client_factory: ClientFactory,
    init_db: bool,
    path: str,
    expected_status_code: int,
    res_data_attr: str,
    expected_value: str | list[dict],
):
    with client_factory(init_db) as client:
        res = client.get(path)
        data = res.get_json()

    assert res.status_code == expected_status_code
    assert data.get(res_data_attr) == expected_value


@pytest.mark.parametrize(
    "request_json, expected_status_code, expected_response",
    [
        (
            {
                "columns": [
                    {"name": "created_at", "data_type": "date"},
                    {"name": "exists", "data_type": "boolean"},
                    {"name": "id", "data_type": "serial PRIMARY KEY"},
                ],
                "table_name": "bar",
            },
            201,
            {
                "columns": [
                    {"name": "created_at", "data_type": "date"},
                    {"name": "exists", "data_type": "boolean"},
                    {"name": "id", "data_type": "integer"},
                ],
                "table_name": "bar",
            },
        ),
        (
            {"table_name": "bar"},
            400,
            {
                "error": [
                    {
                        "loc": ["columns"],
                        "msg": "field required",
                        "type": "value_error.missing",
                    }
                ]
            },
        ),
    ],
)
def test_create_endpoint(
    client_factory: ClientFactory,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    with client_factory(init_db=False) as client:
        res = client.post("/tables/", json=request_json)
        data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "request_json, expected_status_code, expected_response",
    [
        (
            {
                "table_name": "foo",
                "action": "add",
                "remaining_sql": "new_col circle",
            },
            204,
            None,
        ),
        (
            {"action": "add", "remaining_sql": "new_col circle"},
            400,
            {
                "error": [
                    {
                        "loc": ["table_name"],
                        "msg": "field required",
                        "type": "value_error.missing",
                    }
                ]
            },
        ),
        (
            {"table_name": "foo", "action": "nope", "remaining_sql": "n c"},
            400,
            {
                "error": 'syntax error at or near "nope"\nLINE 1: ALTER TABLE "foo" nope n c\n                          ^'
            },
        ),
    ],
)
def test_update_endpoint(
    client_factory: ClientFactory,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    with client_factory(init_db=True) as client:
        res = client.put("/tables/", json=request_json)
        data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "init_db, path, expected_status_code, res_data_attr, expected_value",
    [
        (True, "/tables/foo", 204, "tables", []),
        (False, "/tables/foo", 400, "tables", []),
        (True, "/tables/", 405, "tables", [FOO_TABLE_RESPONSE_JSON]),
        (False, "/tables/", 405, "tables", []),
    ],
)
def test_delete_endpoint(
    client_factory: ClientFactory,
    init_db: bool,
    path: str,
    expected_status_code: int,
    res_data_attr: str,
    expected_value: str | list[dict],
):
    with client_factory(init_db=init_db) as client:
        res = client.delete(path)
        data = client.get("/tables/").get_json()

    assert res.status_code == expected_status_code
    assert data.get(res_data_attr) == expected_value


def test_delete_without_existing_table_error_message(client_factory: ClientFactory):
    with client_factory(init_db=False) as client:
        res = client.delete("/tables/foo")
        data = res.get_json()

    assert data.get("error") == 'table "foo" does not exist'
