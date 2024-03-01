from quart import Quart, jsonify
from quart_cors import cors
from tortoise import Tortoise, run_async
from tortoise.transactions import in_transaction
from appapi.models.index import TORTOISE_ORM
import appapi.models.index as modelIndex
from appapi.models.role_model import Role  # Ensure this is the correct path
from appapi.routes.auth_routes import auth_routes
from appapi.routes.user_routes import user_routes
from appapi.controllers.user_controller import user_controller

app = Quart(__name__)
# Enable CORS for all routes and origins
app = cors(app, allow_origin="http://localhost:8081")
app.register_blueprint(auth_routes)
app.register_blueprint(user_routes)
app.register_blueprint(user_controller, url_prefix='/api')

async def init():
    await Tortoise.init(config=modelIndex.TORTOISE_ORM)
    await Tortoise.generate_schemas(safe=True)

    await initial()

async def initial():
    # skip if already exists
    if await Role.exists():
        return
    await Role.create(id=1, name="user")
    await Role.create(id=2, name="moderator")
    await Role.create(id=3, name="admin")

@app.route("/", methods=["GET"])
async def welcome():
    return jsonify({"message": "Welcome to bezkoder application."})

if __name__ == "__main__":
    run_async(init())
    app.run(port=8080, debug=True)