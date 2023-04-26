from typing import Iterator

import pytest
from app.models import table
from app.models.table import QueryParams, TableCreateRequest, TableUpdateRequest
from flask import Flask
from psycopg.errors import UndefinedTable
from tests.fixtures import app_factory, app_with_tables


@pytest.fixture
def app(app_factory) -> Iterator:
    app = app_factory()
    with app.app_context():
        yield


@pytest.mark.parametrize(
    "params, expected_len, expected_table_name",
    [
        ({}, 10, "table-00"),
        ({"limit": 3}, 3, "table-00"),
        ({"limit": 1, "offset": 2}, 1, "table-02"),
    ],
)
def test_table_get_query_params(
    app_with_tables, params, expected_len, expected_table_name
):
    res = table.get_tables(QueryParams(**params))
    assert len(res["tables"]) == expected_len
    assert res["tables"][0]["table_name"] == expected_table_name


@pytest.mark.parametrize(
    "req_dict, res_dict",
    [
        (
            {
                "table_name": "foo",
                "columns": [
                    {"name": "data", "data_type": "text"},
                    {"name": "my_id", "data_type": "serial PRIMARY KEY"},
                    {"name": "num", "data_type": "integer"},
                ],
            },
            {
                "table_name": "foo",
                "columns": [
                    {"name": "data", "data_type": "text"},
                    {"name": "my_id", "data_type": "integer"},
                    {"name": "num", "data_type": "integer"},
                ],
                "primary_key": "my_id",
            },
        ),
        (
            {
                "table_name": "foo",
                "create_id": "true",
                "columns": [
                    {"name": "data", "data_type": "text"},
                ],
            },
            {
                "table_name": "foo",
                "columns": [
                    {"name": "data", "data_type": "text"},
                    {"name": "id", "data_type": "integer"},
                ],
                "primary_key": "id",
            },
        ),
    ],
)
def test_create(app: Flask, req_dict: dict, res_dict: dict):
    assert table.create_table(TableCreateRequest(**req_dict)) == res_dict


@pytest.mark.parametrize(
    "table_name, req_dict, res",
    [
        (
            "bar",
            {
                "action": "add",
                "remaining_sql": "new_col circle",
            },
            True,
        ),
    ],
)
def test_update(app: Flask, table_name: str, req_dict: dict, res: bool):
    bar_table_dict = {
        "table_name": "bar",
        "columns": [
            {"name": "col1", "data_type": "text"},
            {"name": "col2", "data_type": "text"},
        ],
    }
    table.create_table(TableCreateRequest(**bar_table_dict))

    assert (
        table.update_table(TableUpdateRequest(**req_dict, table_name=table_name)) == res
    )


@pytest.mark.parametrize(
    "injection_attempt",
    [
        ('table-01"; DROP TABLE "table-00";--'),
        ('table-01";DROP TABLE "table-00";--'),
        ('table-01"; DROP/*comment*/TABLE "table-00";--'),
        ('table-01"; DROP TABLE "table-00"; SELECT * FROM "table-01";--'),
        ("table-01\"; DROP TABLE 'table-00';--"),
        ('table-01"; DROP TABLE `table-00`;--'),
    ],
)
def test_drop_sql_injection(app_factory, injection_attempt: str):
    app = app_factory(
        """CREATE TABLE "table-00" (value text);
           CREATE TABLE "table-01" (value text);"""
    )

    with app.app_context():
        assert table.find_table("table-00") is not None

        try:
            table.drop_table(injection_attempt)
        except UndefinedTable:
            pass

        assert table.find_table("table-00") is not None
