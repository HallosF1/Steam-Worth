from fastapi import FastAPI, Depends, HTTPException
from redis.asyncio import Redis
import httpx
import json
from contextlib import asynccontextmanager
from services.redis_service import get_from_redis, set_to_redis
from services.game_service import get_games, save_game, get_game_by_id, get_games_by_ids
from db.database import get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = Redis(host="localhost", port=6380)
    app.state.http_client = httpx.AsyncClient()
    yield
    await app.state.redis.close()
    await app.state.http_client.aclose()

app = FastAPI(lifespan=lifespan)

@app.get("/games")
async def list_games(db=Depends(get_db)):
    redis = app.state.redis
    page = 1
    key = f"games:page:{page}"

    cached_games = await get_from_redis(redis, key)
    if cached_games:
        return {"games": cached_games.decode()}
    games = await get_games(db, page)
    await set_to_redis(redis, key, json.dumps(games), ttl=3600)
    return {"games": games}

@app.get("/games/{id}")
async def find_game_by_id(id: int, db=Depends(get_db)):
    redis = app.state.redis
    key = f"game:{id}"
    cached_game = await get_from_redis(redis, key)
    if cached_game:
        game_data = json.loads(cached_game.decode())
        return game_data
    game = await get_game_by_id(db, id)
    if not game:
        raise HTTPException(status_code=404, detail=f"Game with ID {id} not found")
    await set_to_redis(redis, key, json.dumps(game), ttl=3600)
    return game