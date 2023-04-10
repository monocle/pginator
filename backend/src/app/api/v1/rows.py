from app.models.rows import Rows
from flask import Blueprint, request

rows_bp = Blueprint("rows", __name__, url_prefix="/api/v1/rows")


# Just forward all PostgreSQL errors
@rows_bp.errorhandler(Exception)
def handle_error(error: Exception):
    return {"error": str(error)}, 400


@rows_bp.route("/<string:table_name>", methods=["GET"])
def get_rows(table_name: str):
    rows = Rows(table_name, request.args)
    res = rows.all()

    return {"rows": res}
