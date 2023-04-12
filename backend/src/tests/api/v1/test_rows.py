from typing import Callable

import pytest
from flask.testing import FlaskClient
from mypy_extensions import Arg
from tests.fixtures import client_factory
from tests.fixtures import client_with_users as client

RowClientFactory = Callable[[Arg(str, "sql")], FlaskClient]

FIRST_USER = {"first_name": "first_name0", "id": 1, "last_name": "last_name0"}


@pytest.mark.parametrize(
    "path, query_params, expected_status_code, expected_results, expected_first_id",
    [
        ("/api/v1/rows/users", None, 200, 20, 1),
        ("/api/v1/rows/users", {"foo": 999}, 200, 20, 1),
        ("/api/v1/rows/users", {"limit": 2}, 200, 2, 1),
        ("/api/v1/rows/users", {"offset": 2}, 200, 19, 3),
        (
            "/api/v1/rows/users",
            {"limit": -2},
            400,
            {
                "error": [
                    {
                        "ctx": {"limit_value": 0},
                        "loc": ["limit"],
                        "msg": "ensure this value is greater than 0",
                        "type": "value_error.number.not_gt",
                    }
                ]
            },
            None,
        ),
    ],
)
def test_get_endpoint(
    client: FlaskClient,
    path: str,
    query_params: dict,
    expected_status_code: int,
    expected_results: int | dict,
    expected_first_id: int,
):
    res = client.get(path, query_string=query_params)
    data = res.get_json()
    rows = data.get("rows")

    assert res.status_code == expected_status_code

    if expected_status_code < 400:
        assert len(rows) == expected_results
        assert rows[0].get("id") == expected_first_id
    else:
        assert data == expected_results


@pytest.mark.parametrize(
    "path, expected_status_code, expected_value",
    [
        ("/api/v1/rows/users/1", 200, {"row": FIRST_USER}),
        (
            "/api/v1/rows/users/100",
            404,
            {
                "error": [
                    {"loc": ["id"], "msg": "Invalid id", "type": "value_error.invalid"}
                ]
            },
        ),
        (
            "/api/v1/rows/non_existent_table",
            400,
            {
                "error": 'relation "non_existent_table" does not exist\nLINE 2:     SELECT * FROM "non_existent_table"\n                          ^'
            },
        ),
    ],
)
def test_get_by_id_endpoint(
    client: FlaskClient,
    path: str,
    expected_status_code: int,
    expected_value: dict,
):
    res = client.get(path)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_value


@pytest.mark.parametrize(
    "request_json, expected_status_code, expected_response",
    [
        (
            {"first_name": "foo", "last_name": "bar"},
            201,
            {"id": 22, "first_name": "foo", "last_name": "bar"},
        ),
        (
            {},
            400,
            {
                "error": [
                    {
                        "loc": ["column"],
                        "msg": "column information is required",
                        "type": "value_error.missing",
                    }
                ]
            },
        ),
    ],
)
def test_create_endpoint(
    client: FlaskClient,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    res = client.post("/api/v1/rows/users", json=request_json)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "id, request_json, expected_status_code, expected_response",
    [
        (
            "1",
            {"first_name": "foo", "last_name": "bar"},
            200,
            {"id": 1, "first_name": "foo", "last_name": "bar"},
        ),
        (
            "1",
            {},
            400,
            {
                "error": [
                    {
                        "loc": ["column"],
                        "msg": "column information is required",
                        "type": "value_error.missing",
                    }
                ]
            },
        ),
        (
            "100",
            {"first_name": "foo", "last_name": "bar"},
            404,
            {
                "error": [
                    {"loc": ["id"], "msg": "Invalid id", "type": "value_error.invalid"}
                ]
            },
        ),
    ],
)
def test_update_endpoint(
    client: FlaskClient,
    id: str,
    request_json: dict,
    expected_status_code: int,
    expected_response: dict,
):
    res = client.put(f"/api/v1/rows/users/{id}", json=request_json)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response


@pytest.mark.parametrize(
    "path, expected_status_code, expected_response",
    [
        ("/api/v1/rows/users/1", 200, {"id": 1}),
        (
            "/api/v1/rows/users/100",
            404,
            {
                "error": [
                    {"loc": ["id"], "msg": "Invalid id", "type": "value_error.invalid"}
                ]
            },
        ),
    ],
)
def test_delete_endpoint(
    client: FlaskClient,
    path: str,
    expected_status_code: int,
    expected_response: dict,
):
    res = client.delete(path)
    data = res.get_json()

    assert res.status_code == expected_status_code
    assert data == expected_response
