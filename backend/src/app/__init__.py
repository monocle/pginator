from app.create_app import create_app

app = create_app()


@app.route("/")
@app.route("/index")
def index():
    return {"message": "hello"}
