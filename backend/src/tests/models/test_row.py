import pytest
from app.models.row import Row
from app.models.table import Table
from tests.fixtures import app_factory
from tests.fixtures import app_with_users as app

TABLE_NAME = "users"


@pytest.mark.parametrize(
    "params, expected_count",
    [
        ({}, 20),
        ({"limit": 2, "offset": 2}, 2),
        ({"limit": 2, "offset": 22}, 0),
        ({"limit": -1}, None),
    ],
)
def test_row_all(app, params, expected_count):
    row = Row(TABLE_NAME, query_params_dict=params)
    results = row.all()

    if expected_count is None:
        assert results is None
    else:
        offset = params.get("offset", 0)
        last_idx = expected_count - 1

        assert results is not None
        assert len(results) == expected_count

        if expected_count:
            assert results[last_idx]["first_name"] == f"first_name{last_idx+ offset}"


@pytest.mark.parametrize(
    "row_id,expected_result",
    [
        (
            "1",
            {
                "id": 1,
                "first_name": "first_name0",
                "last_name": "last_name0",
            },
        ),
        (None, None),
    ],
)
def test_row_find(app, row_id, expected_result):
    row = Row(TABLE_NAME, id=row_id)
    found_row = row.find()

    if expected_result is None:
        assert found_row is None
    else:
        assert found_row == expected_result


@pytest.mark.parametrize(
    "request_dict,expected_result",
    [
        (
            {"first_name": "foo", "last_name": "bar"},
            {"first_name": "foo", "last_name": "bar", "id": 22},
        ),
        ({"first_name": "foo"}, {"first_name": "foo", "id": 22, "last_name": None}),
        ({"first_name": "foo", "last_name": "bar", "extra_column": "baz"}, None),
        (
            {"first_name": "foo", "last_name": "bar@#$%^&*()_+="},
            {"first_name": "foo", "last_name": "bar@#$%^&*()_+=", "id": 22},
        ),
        ({}, None),
    ],
)
def test_row_create(app, request_dict, expected_result):
    row = Row(TABLE_NAME, request_dict=request_dict)
    res = row.create()

    if expected_result is None:
        assert res is None
    else:
        assert res
        for key, value in expected_result.items():
            assert res.get(key) == value


@pytest.mark.parametrize(
    "request_dict, expected_result",
    [
        (
            {"first_name": "updated value"},
            {"id": 1, "first_name": "updated value", "last_name": "last_name0"},
        ),
        (
            {"first_name": "updated value", "last_name": "another updated value"},
            {
                "id": 1,
                "first_name": "updated value",
                "last_name": "another updated value",
            },
        ),
        ({}, None),
    ],
)
def test_row_update(app, request_dict: dict, expected_result: dict):
    row = Row(TABLE_NAME, request_dict=request_dict, id="1")
    res = row.update()

    assert res == expected_result


@pytest.mark.parametrize(
    "row_id, expected_result",
    [
        ("1", {"id": 1}),
        (None, None),
    ],
)
def test_row_delete(app, row_id, expected_result):
    row = Row(TABLE_NAME, id=row_id)
    res = row.delete()

    assert res == expected_result

    if row_id is not None:
        assert row.find() is None


def test_row_table_name_validation(app):
    row = Row("")

    assert not row.valid
    assert row.errors == (
        {
            "loc": ("table_name",),
            "msg": "field required",
            "type": "value_error.missing",
        },
    )


@pytest.mark.parametrize(
    "query_params_dict, expected_errors",
    [
        (
            {"limit": -1},
            (
                {
                    "ctx": {"limit_value": 0},
                    "loc": ("limit",),
                    "msg": "ensure this value is greater than 0",
                    "type": "value_error.number.not_gt",
                },
            ),
        ),
        (
            {"offset": -1},
            (
                {
                    "ctx": {"limit_value": 0},
                    "loc": ("offset",),
                    "msg": "ensure this value is greater than or equal to 0",
                    "type": "value_error.number.not_ge",
                },
            ),
        ),
        (
            {"limit": -1, "offset": -1},
            (
                {
                    "loc": ("limit",),
                    "msg": "ensure this value is greater than 0",
                    "type": "value_error.number.not_gt",
                    "ctx": {"limit_value": 0},
                },
                {
                    "loc": ("offset",),
                    "msg": "ensure this value is greater than or equal to 0",
                    "type": "value_error.number.not_ge",
                    "ctx": {"limit_value": 0},
                },
            ),
        ),
        ({"limit": 1}, ()),
        ({"offset": 0}, ()),
    ],
)
def test_row_query_params_validation(app, query_params_dict, expected_errors):
    row = Row(
        TABLE_NAME,
        query_params_dict=query_params_dict,
    )

    if expected_errors:
        assert not row.valid
    else:
        assert row.valid

    assert row.errors == expected_errors


@pytest.mark.parametrize(
    "request_dict, expected_errors",
    [
        (
            {"invalid_column": "test_value"},
            (
                {
                    "loc": ("invalid_column",),
                    "msg": 'Invalid columns for table "users"',
                    "type": "value_error.invalid",
                },
            ),
        ),
        (
            {},
            (
                {
                    "loc": ("column",),
                    "msg": "column information is required",
                    "type": "value_error.missing",
                },
            ),
        ),
    ],
)
def test_row_invalid_column_names(app, request_dict, expected_errors):
    row = Row(TABLE_NAME, request_dict=request_dict)

    if expected_errors:
        assert not row.valid
    else:
        assert row.valid

    assert row.errors == expected_errors


@pytest.mark.parametrize(
    "method, id, request_dict",
    [
        ("update", "-1", {"first_name": "foo", "last_name": "bar"}),
        ("update", None, {"first_name": "foo", "last_name": "bar"}),
        ("find", None, None),
        ("find", "-1", None),
        ("delete", None, None),
        ("delete", "-1", None),
    ],
)
def test_invalid_id(app, method, id, request_dict):
    row = Row(TABLE_NAME, id=id, request_dict=request_dict)

    getattr(row, method)()

    assert not row.valid
    assert row.errors == (
        {"loc": ("id",), "msg": "Invalid id", "type": "value_error.invalid"},
    )


def test_row_sql_injection(app):
    request_dict = {"first_name": 'normal_value\'); DROP TABLE "users"; --'}
    row = Row(TABLE_NAME, request_dict=request_dict)

    assert Table.find("users") is not None

    row.create()

    assert Table.find("users") is not None
