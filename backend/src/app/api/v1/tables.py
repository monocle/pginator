from app.models.table import Table
from flask import Blueprint, request

tables_bp = Blueprint("tables", __name__, url_prefix="/api/v1/tables")


# Forward all PostgreSQL errors
@tables_bp.errorhandler(Exception)
def handle_error(error: Exception):
    return {"error": str(error)}, 400


@tables_bp.route("/")
def get_tables():
    return {"tables": Table.all()}


@tables_bp.route("/<string:table_name>", methods=["GET"])
def get_table(table_name: str):
    if table := Table.find(table_name):
        return table, 200

    return {"error": f"Table '{table_name}' does not exist"}, 404


@tables_bp.route("/", methods=["POST"])
def create_table():
    table = Table(request.json)

    if table.valid:
        return table.create() or "", 201

    return {"error": table.errors}, 400


@tables_bp.route("/", methods=["PUT"])
def update_table():
    table = Table(request.json, is_update_request=True)

    if table.valid and table.update():
        return "", 204

    return {"error": table.errors}, 400


# If there is no table_name, Flask will send a 405 without calling this method.
@tables_bp.route("/<string:table_name>", methods=["DELETE"])
def drop_table(table_name: str):
    Table.drop(table_name)
    return "", 204
