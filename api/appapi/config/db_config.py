import asyncpg

async def create_pool():
    return await asyncpg.create_pool(
        user='postgres',
        password='kr3310',
        database='BTD-Management',
        host='localhost',
        port=5432, # Default PostgreSQL port
        max_size=5,
        min_size=0,
        max_query_size=30000,
        max_inactive_connection_lifetime=10,
    )