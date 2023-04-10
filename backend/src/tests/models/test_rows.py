from typing import TYPE_CHECKING

TYPE_CHECKING = True

import pytest
from app.models.rows import Rows
from tests.fixtures import app_factory

CREATE_TABLE_SQL = "CREATE TABLE users (id serial PRIMARY KEY, username text); "


def test_get_all(app_factory):
    app = app_factory(
        f"""{CREATE_TABLE_SQL}
        INSERT INTO users (username)
            VALUES ('carlos'), ('alice'), ('jz')
        """
    )

    with app.app_context():
        table_name = "users"
        query_params = {}
        rows = Rows(table_name, query_params)

        assert rows.valid

        results = rows.all()

        assert len(results) == 3
        assert results[0]["username"] == "carlos"
        assert results[1]["username"] == "alice"
        assert results[2]["username"] == "jz"


def test_validates_table_name(app_factory):
    with app_factory().app_context():
        rows = Rows("")

        assert not rows.valid
        assert rows.errors == (
            {
                "loc": ("table_name",),
                "msg": "field required",
                "type": "value_error.missing",
            },
        )
