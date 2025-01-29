from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.Game import Game
import httpx


async def get_page(page: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://steamspy.com/api.php?request=all&page={page}")
        if res.status_code == 200:
            return res.json()
        return {"error": "Failed to fetch data"}

async def get_games(db: AsyncSession, page: int = 1):
    while True:
        games = await get_page(page)
        if not games or "error" in games:
            break

        for game_id, game_data in games.items():
            existing_game = await db.execute(
                Game.__table__.select().where(Game.appid == game_id)
            )
            if existing_game.first() is None:
                price = game_data.get("price", 0)
                if price is None:
                    price = 0
                game = Game(appid=game_data["appid"], name=game_data["name"], price=price)
                db.add(game)
        await db.commit()
        page += 1

async def save_game(db: AsyncSession, id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://steamspy.com/api.php?request=appdetails&appid={id}")
    if res.status_code == 200:
        game_data = await res.json()
        price = game_data.get("price", 0)
        game = Game(appid=game_data["appid"], name=game_data["name"], price=price)
        db.add(game)
        await db.commit()
        await db.refresh(game)
        return game
    return {"error": "Failed to fetch data"}

async def get_game_by_id(db: AsyncSession, id: int):
    result = await db.execute(select(Game).where(Game.appid == id))
    game = result.scalars().one_or_none()
    
    if game:
        return {
            "id": game.id,
            "appid": game.appid,
            "name": game.name,
            "price": game.price
        }
    return None

async def get_games_by_ids(db: AsyncSession, ids: list):
    result = await db.execute(Game.__table__.select().where(Game.appid.in_(ids)))
    return result.scalars().all()
