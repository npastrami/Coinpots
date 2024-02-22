from quart import Quart, request, jsonify
import asyncpg
from quart_cors import cors, route_cors

app = Quart(__name__)
app = cors(app, allow_origin="*")

async def create_pool():
    pool = await asyncpg.create_pool(user='postgres', password='kr3310', database='BTD-Management', host='127.0.0.1')
    await setup_db(pool)
    return pool

async def setup_db(pool):
    async with pool.acquire() as connection:
        await connection.execute('''
            CREATE TABLE IF NOT EXISTS user_auth (
                username VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL
            );
        ''')

@app.route('/api/auth/signup', methods=['POST'])
async def signup():
    data = await request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    status = 'user' # default status

    pool = await create_pool()
    async with pool.acquire() as connection:
        await connection.execute('''
            INSERT INTO user_auth (username, password, email, status) VALUES ($1, $2, $3, $4)
        ''', username, password, email, status)

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
async def login():
    data = await request.get_json()
    username = data.get('username')
    password = data.get('password')

    pool = await create_pool()
    async with pool.acquire() as connection:
        user = await connection.fetchrow('''
            SELECT * FROM user_auth WHERE username = $1 AND password = $2
        ''', username, password)

    if user is None:
        return jsonify({'message': 'Invalid username or password'}), 401

    return jsonify({'message': 'Logged in successfully'}), 200

@app.route('/api/auth/users', methods=['GET'])
async def get_users():
    pool = await create_pool()
    async with pool.acquire() as connection:
        users = await connection.fetch('SELECT * FROM user_auth')
        return jsonify([dict(user) for user in users])

@app.before_serving
async def startup():
    app.pool = await create_pool()

@app.after_serving
async def cleanup():
    await app.pool.close()

if __name__ == "__main__":
    app.run(port=8080)