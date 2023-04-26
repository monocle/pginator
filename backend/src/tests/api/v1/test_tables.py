from typing import Callable

import pytest
from flask.testing import FlaskClient
from mypy_extensions import Arg
from tests.fixtures import client_factory, client_with_tables

ClientFactory = Callable[[Arg(bool, "init_db")], FlaskClient]


@pytest.fixture
def client_factory_one_table(client_factory) -> ClientFactory:
    def factory(init_db=False):
        sql = "CREATE TABLE foo (id serial PRIMARY KEY, num integer, address text)"
        return client_factory(sql if init_db else None)

    return factory


FOO_TABLE_RESPONSE = {
    "columns": [
        {"name": "address", "data_type": "text"},
        {"name": "id", "data_type": "integer"},
        {"name": "num", "data_type": "integer"},
    ],
    "table_name": "foo",
    "primary_key": "id",
}


@pytest.mark.parametrize(
    "init_db, path, expected_status_code, expected_value",
    [
        (
            False,
            "/api/v1/tables/",
            200,
            {"tables": [], "limit": 10, "offset": 0},
        ),
        (
            True,
            "/api/v1/tables/",
            200,
            {"tables": [FOO_TABLE_RESPONSE], "limit": 10, "offset": 0},
        ),
        (False, "/api/v1/tables/foo", 404, {"error": "Table 'foo' does not exist"}),
        (True, "/api/v1/tables/foo", 200, FOO_TABLE_RESPONSE),
    ],
)
def test_get_endpoints(
    client_factory_one_table: ClientFactory,
    init_db: bool,
    path: str,
    expected_status_code: int,
    expected_value: str | list[dict],
):
    client = client_factory_one_table(init_db)
    res = client.get(path)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_value


@pytest.mark.parametrize(
    "query_params, expected_status_code, expected_results, expected_first_table_name",
    [
        (None, 200, 10, "table-00"),
        ({"offset": 3}, 200, 8, "table-03"),
        ({"limit": 2}, 200, 2, "table-00"),
        ({"foo": 2}, 200, 10, "table-00"),
        (
            {"limit": -2},
            400,
            {
                "error": "1 validation error for QueryParams\nlimit\n  ensure this value is greater than 0 (type=value_error.number.not_gt; limit_value=0)"
            },
            None,
        ),
    ],
)
def test_get_query_params(
    client_with_tables: FlaskClient,
    query_params: dict,
    expected_status_code: int,
    expected_results: int | dict,
    expected_first_table_name: str,
):
    res = client_with_tables.get("/api/v1/tables/", query_string=query_params)
    data = res.get_json()

    assert res.status_code == expected_status_code

    if expected_first_table_name is not None:
        tables = data.get("tables")

        assert len(tables) == expected_results
        assert tables[0]["table_name"] == expected_first_table_name
    else:
        assert data == expected_results


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
                "error": "1 validation error for TableCreateRequest\ncolumns\n  field required (type=value_error.missing)"
            },
        ),
    ],
)
def test_create_endpoint(
    client_factory_one_table: ClientFactory,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    client = client_factory_one_table(False)
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
    client_factory_one_table: ClientFactory,
    table_name: str,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    client = client_factory_one_table(True)
    res = client.put(f"/api/v1/tables/{table_name}", json=request_json)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "init_db, path, expected_status_code, res_data_attr, expected_value",
    [
        (True, "/api/v1/tables/foo", 204, "tables", []),
        (False, "/api/v1/tables/foo", 400, "tables", []),
        (True, "/api/v1/tables/", 405, "tables", [FOO_TABLE_RESPONSE]),
        (False, "/api/v1/tables/", 405, "tables", []),
    ],
)
def test_delete_endpoint(
    client_factory_one_table: ClientFactory,
    init_db: bool,
    path: str,
    expected_status_code: int,
    res_data_attr: str,
    expected_value: str | list[dict],
):
    client = client_factory_one_table(init_db)
    res = client.delete(path)
    data = client.get("/api/v1/tables/").get_json()

    assert res.status_code == expected_status_code
    assert data.get(res_data_attr) == expected_value


def test_delete_without_existing_table_error_message(
    client_factory_one_table: ClientFactory,
):
    with client_factory_one_table(False) as client:
        res = client.delete("/api/v1/tables/foo")
        data = res.get_json()

    assert data.get("error") == 'table "foo" does not exist'
