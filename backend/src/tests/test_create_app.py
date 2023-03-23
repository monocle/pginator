from flask import Flask
import psycopg as pg
from app.create_app import create_app


def fetch_postgres_db_name(app: Flask):
    db_uri = app.config.get("DB_URI")

    if not db_uri:
        return "No database URI available. Is there a '.env' file?"

    with pg.connect(db_uri) as conn:
        db = conn.execute("SELECT current_database()").fetchone()
        return "No database found." if not db else db[0]


def test_is_in_development_mode_by_default():
    app = create_app()

    assert not app.config.get("TESTING")
    assert not app.testing
    assert fetch_postgres_db_name(app) == "development"


def test_testing_can_be_turned_on():
    app = create_app(testing=True)

    assert app.config.get("TESTING")
    assert app.testing
    assert fetch_postgres_db_name(app) == "test"
