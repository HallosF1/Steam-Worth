from fastapi import FastAPI
from services.games import get_games, save_game
from db.database import Game, Session

session = Session()
app = FastAPI()

def get_db():
    session = Session()
    try:
        yield session  
    finally:
        session.close()  

@app.get("/games")
async def list_games():
    page = 1

    while True:

        games = get_games(page)
        if not games:
            break
        if "error" in games:
            return games
        
        for game_id, game_data in games.items():
            price = game_data.get("price")
            if price is None:
                price = 0
            game = Game(game_data.get("appid"), game_data.get("name"), price)
            session.add(game)
        session.commit()
        page += 1
    return {"Successfull": "Games have saved in your database"}

@app.get("/games/{id}")
async def find_game_by_id(id: int):
    game = session.query(Game).filter(Game.appid == id).first()
    if not game:
        print(f"Game not found with {id} id")
        game = save_game(id)
        return game
    return game

@app.get("/games_owned/")
async def find_games_by_ids(ids: list):
    return session.query(Game).filter(Game.appid.in_(ids)).all()
