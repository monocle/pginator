from os import environ
from flask import Flask


def make_db_uri(testing: bool):
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
    app.config.update(DEBUG=True, TESTING=testing, DB_URI=make_db_uri(testing))
    # app.register_blueprint(app_blueprint)

    return app
