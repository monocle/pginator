from flask import Blueprint, request

from backend.src.app.models.row import Row

rows_bp = Blueprint("rows", __name__, url_prefix="/api/v1/rows")


# Just forward all PostgreSQL errors
@rows_bp.errorhandler(Exception)
def handle_error(error: Exception):
    return {"error": str(error)}, 400


@rows_bp.route("/<string:table_name>", methods=["GET"])
def get_rows(table_name: str):
    row = Row(table_name, request.args)
    res = row.all()

    return {"rows": res}
