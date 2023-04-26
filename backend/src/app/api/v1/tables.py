import app.models.table as table
from app.models.table import QueryParams, TableCreateRequest, TableUpdateRequest
from flask import Blueprint, request

tables_bp = Blueprint("tables", __name__, url_prefix="/api/v1/tables")


# Forward all query params and PostgreSQL errors
@tables_bp.errorhandler(Exception)
def handle_error(error: Exception):
    return {"error": str(error)}, 400


@tables_bp.route("/")
def get_tables():
    query_params = QueryParams(**request.args)
    return table.get_tables(query_params), 200


@tables_bp.route("/<string:table_name>", methods=["GET"])
def get_table(table_name: str):
    if res := table.find_table(table_name):
        return res, 200

    return {"error": f"Table '{table_name}' does not exist"}, 404


@tables_bp.route("/", methods=["POST"])
def create_table():
    create_request = TableCreateRequest(**request.json)  # type: ignore
    return table.create_table(create_request) or "", 201


@tables_bp.route("/<string:table_name>", methods=["PUT"])
def update_table(table_name: str):
    update_request = TableUpdateRequest(**request.json, table_name=table_name)  # type: ignore
    table.update_table(update_request)
    return "", 204


# If there is no table_name, Flask will send a 405 without calling this method.
@tables_bp.route("/<string:table_name>", methods=["DELETE"])
def drop_table(table_name: str):
    table.drop_table(table_name)
    return "", 204
