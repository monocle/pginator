from typing import Callable

import pytest
from flask.testing import FlaskClient
from mypy_extensions import Arg
from tests.fixtures import client_factory as _client_factory

ClientFactory = Callable[[Arg(bool, "init_db")], FlaskClient]


@pytest.fixture
def client_factory(_client_factory) -> ClientFactory:
    def factory(init_db=False):
        sql = "CREATE TABLE foo (id serial PRIMARY KEY, num integer, address text)"
        return _client_factory(sql if init_db else None)

    return factory


FOO_TABLE_RESPONSE_JSON = {
    "columns": [
        {"name": "address", "data_type": "text"},
        {"name": "id", "data_type": "integer"},
        {"name": "num", "data_type": "integer"},
    ],
    "table_name": "foo",
    "primary_key": "id",
}


@pytest.mark.parametrize(
    "init_db, path, expected_status_code, res_data_attr, expected_value",
    [
        (False, "/api/v1/tables/", 200, "tables", []),
        (True, "/api/v1/tables/", 200, "tables", [FOO_TABLE_RESPONSE_JSON]),
        (False, "/api/v1/tables/foo", 404, "error", "Table 'foo' does not exist"),
        (True, "/api/v1/tables/foo", 200, "table_name", "foo"),
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
    client = client_factory(init_db)
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
                "primary_key": "id",
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
    client = client_factory(False)
    res = client.post("/api/v1/tables/", json=request_json)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "table_name, request_json, expected_status_code, expected_response",
    [
        (
            "foo",
            {
                "action": "add",
                "remaining_sql": "new_col circle",
            },
            204,
            None,
        ),
        (
            "foo",
            {"action": "nope", "remaining_sql": "n c"},
            400,
            {
                "error": 'syntax error at or near "nope"\nLINE 1: ALTER TABLE "foo" nope n c\n                          ^'
            },
        ),
        ("", {"action": "add", "remaining_sql": "new_col circle"}, 405, None),
        (
            "Nope",
            {"action": "add", "remaining_sql": "new_col circle"},
            400,
            {"error": 'relation "Nope" does not exist'},
        ),
    ],
)
def test_update_endpoint(
    client_factory: ClientFactory,
    table_name: str,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    client = client_factory(True)
    res = client.put(f"/api/v1/tables/{table_name}", json=request_json)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "init_db, path, expected_status_code, res_data_attr, expected_value",
    [
        (True, "/api/v1/tables/foo", 204, "tables", []),
        (False, "/api/v1/tables/foo", 400, "tables", []),
        (True, "/api/v1/tables/", 405, "tables", [FOO_TABLE_RESPONSE_JSON]),
        (False, "/api/v1/tables/", 405, "tables", []),
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
    client = client_factory(init_db)
    res = client.delete(path)
    data = client.get("/api/v1/tables/").get_json()

    assert res.status_code == expected_status_code
    assert data.get(res_data_attr) == expected_value


def test_delete_without_existing_table_error_message(client_factory: ClientFactory):
    with client_factory(False) as client:
        res = client.delete("/api/v1/tables/foo")
        data = res.get_json()

    assert data.get("error") == 'table "foo" does not exist'
