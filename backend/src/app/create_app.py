from os import environ

from app.api.v1.rows import rows_bp
from app.api.v1.tables import tables_bp
from flask import Flask


def make_db_uri(testing: bool) -> str:
    return (
        "postgresql://"
        + (environ.get("POSTGRES_USER") or "postgres")
        + ":"
        + (environ.get("POSTGRES_PASSWORD") or "password")
        + "@"
        + (environ.get("POSTGRES_HOST") or "database")
        + ":"
        + (environ.get("POSTGRES_PORT") or "5432")
        + "/"
        + ("test" if testing else "development")
    )


def create_app(testing=False):
    app = Flask(__name__)
    app.config.update(
        ENV="testing" if testing else "development",
        DEBUG=True,
        TESTING=testing,
        DB_URI=make_db_uri(testing),
        SECRET_KEY=environ.get("FLASK_SECRET_KEY"),
    )
    app.register_blueprint(tables_bp)
    app.register_blueprint(rows_bp)

    return app
