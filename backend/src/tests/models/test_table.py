from typing import Iterator

import pytest
from app.create_app import create_app
from app.db import DB
from app.models.table import Table
from flask import Flask


@pytest.fixture
def app() -> Iterator[Flask]:
    app = create_app(testing=True)
    db = DB(app)
    db.drop_all_tables()

    try:
        yield app
    finally:
        db.drop_all_tables()


@pytest.mark.parametrize(
    "req_dict, res_dict",
    [
        (
            {
                "table_name": "foo",
                "columns": [
                    {"name": "data", "data_type": "text"},
                    {"name": "id", "data_type": "serial PRIMARY KEY"},
                    {"name": "num", "data_type": "integer"},
                ],
            },
            {
                "table_name": "foo",
                "columns": [
                    {"name": "data", "data_type": "text"},
                    {"name": "id", "data_type": "integer"},
                    {"name": "num", "data_type": "integer"},
                ],
            },
        ),
        ({}, None),
    ],
)
def test_create(app: Flask, req_dict: dict, res_dict: dict):
    with app.app_context():
        table = Table(req_dict)
        assert table.create() == res_dict


@pytest.mark.parametrize(
    "req_dict, res",
    [
        (
            {
                "table_name": "bar",
                "action": "add",
                "remaining_sql": "new_col circle",
            },
            True,
        ),
        (
            {
                "table_name": "bar",
                "action": "drop",
                "remaining_sql": "col1",
            },
            True,
        ),
        ({}, False),
        (
            {
                "table_name": "bar",
                "action": "drop",
                "remaining_sql": "col1, drop col2",
            },
            True,
        ),
    ],
)
def test_update(app: Flask, req_dict: dict, res: bool):
    bar_table_dict = {
        "table_name": "bar",
        "columns": [
            {"name": "col1", "data_type": "text"},
            {"name": "col2", "data_type": "text"},
        ],
    }
    with app.app_context():
        Table(bar_table_dict).create()
        table = Table(req_dict, is_update_request=True)

        assert table.update() == res


@pytest.mark.parametrize(
    "req_dict, expected_errors",
    [
        ({"table_name": "a", "columns": [{"name": "b", "data_type": "boolean"}]}, ()),
        (
            {"columns": [{"name": "b", "data_type": "boolean"}]},
            (
                {
                    "loc": ("table_name",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
        (
            {"table_name": "a"},
            (
                {
                    "loc": ("columns",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
        (
            {"table_name": "a", "columns": []},
            (
                {
                    "loc": ("columns",),
                    "msg": "ensure this value has at least 1 items",
                    "type": "value_error.list.min_items",
                    "ctx": {"limit_value": 1},
                },
            ),
        ),
        (
            {"table_name": "a", "columns": [{"data_type": "boolean"}]},
            (
                {
                    "loc": ("columns", 0, "name"),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
        (
            {"table_name": "a", "columns": [{"name": "b"}]},
            (
                {
                    "loc": ("columns", 0, "data_type"),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
        (
            {},
            (
                {
                    "loc": ("table_name",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
                {
                    "loc": ("columns",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
    ],
)
def test_validation_for_create(app: Flask, req_dict: dict, expected_errors: list[str]):
    with app.app_context():
        table = Table(req_dict, False)
        assert table.errors == expected_errors


@pytest.mark.parametrize(
    "req_dict, expected_errors",
    [
        ({"table_name": "f", "action": "add", "remaining_sql": "c t"}, ()),
        (
            {"action": "add", "remaining_sql": "c t"},
            (
                {
                    "loc": ("table_name",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
        (
            {"table_name": "f", "action": "add"},
            (
                (
                    {
                        "loc": ("remaining_sql",),
                        "msg": "field required",
                        "type": "value_error.missing",
                    },
                )
            ),
        ),
        (
            {"table_name": "f", "remaining_sql": "c t"},
            (
                {
                    "loc": ("action",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
        (
            {},
            (
                {
                    "loc": ("table_name",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
                {
                    "loc": ("action",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
                {
                    "loc": ("remaining_sql",),
                    "msg": "field required",
                    "type": "value_error.missing",
                },
            ),
        ),
    ],
)
def test_validation_for_update(app: Flask, req_dict: dict, expected_errors: list[str]):
    with app.app_context():
        table = Table(req_dict, is_update_request=True)
        assert table.errors == expected_errors
