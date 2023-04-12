import pytest
from app.models.row import Row
from app.models.table import Table
from tests.fixtures import app_factory

NUM_ROWS = 21
TABLE_NAME = "users"


@pytest.fixture
def app(app_factory):
    values = ", ".join(
        [f"('first_name{i}', 'last_name{i}')" for i in range(0, NUM_ROWS)]
    )
    app = app_factory(
        f"""
        CREATE TABLE {TABLE_NAME} (id serial PRIMARY KEY, first_name text, last_name text);
        INSERT INTO {TABLE_NAME} (first_name, last_name)
            VALUES {values}
        """
    )
    with app.app_context():
        yield


@pytest.mark.parametrize(
    "params, expected_count",
    [({}, 20), ({"limit": 2, "offset": 2}, 2), ({"limit": 2, "offset": 22}, 0)],
)
def test_row_all(app, params, expected_count):
    offset = params.get("offset", 0)
    last_idx = expected_count - 1
    row = Row(TABLE_NAME, params_dict=params)
    results = row.all() or []

    assert len(results) == expected_count

    if expected_count:
        assert results[last_idx]["first_name"] == f"first_name{last_idx+ offset}"


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
    "request_dict, expected_errors",
    [
        (
            {"first_name": "foo", "last_name": "bar"},
            (),
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
        (
            {"first_name": "foo", "doesnt_exist": "bar"},
            (
                {
                    "loc": ("doesnt_exist",),
                    "msg": f'Invalid columns for table "{TABLE_NAME}"',
                    "type": "value_error.invalid",
                },
            ),
        ),
    ],
)
def test_row_request_dict_validation(app, request_dict, expected_errors):
    row = Row(TABLE_NAME, request_dict=request_dict)

    row.create()
    assert row.errors == expected_errors


def test_row_sql_injection(app):
    request_dict = {"first_name": 'normal_value\'); DROP TABLE "users"; --'}
    row = Row(TABLE_NAME, request_dict=request_dict)

    assert Table.find("users") is not None

    row.create()

    assert Table.find("users") is not None
