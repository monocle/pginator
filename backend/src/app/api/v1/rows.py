from app.models.row import Row
from flask import Blueprint, request

rows_bp = Blueprint("rows", __name__, url_prefix="/api/v1/rows")


@rows_bp.errorhandler(Exception)
def handle_error(error: Exception):
    return {"error": str(error)}, 400


@rows_bp.route("/<string:table_name>", methods=["GET"])
def get_rows(table_name: str):
    row = Row(table_name, query_params_dict=request.args)

    if row.valid:
        return {"rows": row.all()}, 200
    return {"error": row.errors}, 400


@rows_bp.route("/<string:table_name>/<string:row_id>", methods=["GET"])
def get_row_by_id(table_name: str, row_id: str):
    row = Row(table_name, id=row_id)

    if res := row.find():
        return {"row": res}, 200

    return {"error": row.errors}, 404


@rows_bp.route("/<string:table_name>", methods=["POST"])
def create_row(table_name: str):
    row = Row(table_name, request_dict=request.json)

    if res := row.create():
        return res, 201
    else:
        return {"error": row.errors}, 400


@rows_bp.route("/<string:table_name>/<string:row_id>", methods=["PUT"])
def update_row(table_name: str, row_id: str):
    row = Row(table_name, id=row_id, request_dict=request.json)

    if not row.valid:
        return {"error": row.errors}, 400

    if res := row.update():
        return res, 200

    return {"error": row.errors}, 404


@rows_bp.route("/<string:table_name>/<string:row_id>", methods=["DELETE"])
def delete_row(table_name: str, row_id: str):
    row = Row(table_name, id=row_id)

    if res := row.delete():
        return res, 200

    return {"error": row.errors}, 404
