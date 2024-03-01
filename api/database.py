import asyncpg

class Database:
    def __init__(self, user, password, database, host):
        self.user = user
        self.password = password
        self.database = database
        self.host = host
        self.pool = None

    async def create_pool(self):
        self.pool = await asyncpg.create_pool(
            user=self.user,
            password=self.password,
            database=self.database,
            host=self.host
        )
        await self.setup_db()

    async def setup_db(self):
        async with self.pool.acquire() as connection:
            await connection.execute('''
                CREATE TABLE IF NOT EXISTS user_auth (
                    username VARCHAR(255) PRIMARY KEY,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    status VARCHAR(255) NOT NULL
                );
            ''')

    async def close(self):
        await self.pool.close()