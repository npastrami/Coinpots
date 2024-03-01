from quart import Quart, jsonify, request
from quart_cors import cors
from tortoise import Tortoise, run_async
from tortoise.transactions import in_transaction
from appapi.models.index import TORTOISE_ORM
import appapi.models.index as modelIndex
from appapi.models.role_model import Role  # Ensure this is the correct path
from appapi.routes.auth_routes import auth_routes
from appapi.routes.user_routes import user_routes
from appapi.controllers.user_controller import user_controller
from jackpot import Jackpot
from database import Database
import asyncio

app = Quart(__name__)
# Enable CORS for all routes and origins
app = cors(app, allow_origin="http://localhost:8081")
app.register_blueprint(auth_routes)
app.register_blueprint(user_routes)
app.register_blueprint(user_controller, url_prefix='/api')

db_instance = None

async def init():
    global db_instance
    await Tortoise.init(config=modelIndex.TORTOISE_ORM)
    await Tortoise.generate_schemas(safe=True)
    db_instance = Database(user="postgres", password="kr3310", database="BTD-Management", host="127.0.0.1")
    await db_instance.create_pool()

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

@app.route("/api/jackpot/spin", methods=["POST"])
async def spin_jackpot():
    # You might want to fetch real player data here instead of using test data
    jackpot = Jackpot()
    # Add players to the jackpot. This should be replaced with actual logic to add players
    jackpot.add_player('Alice', 100)
    jackpot.add_player('Bob', 200)
    jackpot.add_player('Charlie', 150)
    
    winner, position = jackpot.execute_jackpot()  # Modify execute_jackpot to return winner and position
    return jsonify({"winner": winner, "position": position})

@app.route("/api/jackpot/addEntry", methods=["POST"])
async def add_entry():
    data = await request.get_json()
    username = data.get('username')
    amount = data.get('amount')
    print(f'trying to add entry for {username} with amount {amount}')
    # Assuming `Database` is properly integrated and instantiated
    await db_instance.create_entry(username, amount)
    return jsonify({"message": "Entry added successfully"}), 200

async def jackpot_timer():
    while True:
        await asyncio.sleep(60)  # Wait for 10 minutes
        await execute_jackpot_logic()

async def execute_jackpot_logic():
    # Logic to query the database, calculate the winner, and reset for the next round
    print("Executing jackpot logic")

if __name__ == "__main__":
    # Initialize the event loop
    loop = asyncio.get_event_loop()
    
    # Run the initial setup tasks
    loop.run_until_complete(init())
    
    # Now that the loop is running, we can schedule additional tasks
    loop.create_task(jackpot_timer())
    
    # Finally, start the Quart app within the event loop
    loop.run_until_complete(app.run_task(port=8080, debug=True))