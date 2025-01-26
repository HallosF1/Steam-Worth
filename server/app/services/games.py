import requests
from db.database import Game, Session


session = Session()

def get_games(page: int):
    res = requests.get(f"https://steamspy.com/api.php?request=all&page={page}")
    if res.status_code == 200:
        return res.json()
    else:
        return {"error": "Failed to fetch data"}

def save_game(id: int):
    res = requests.get(f"https://steamspy.com/api.php?request=appdetails&appid={id}")
    if res.status_code == 200:
        res = res.json()
        price = res.get("price")
        if price is None:
            price = 0
        game = Game(res.get("appid"), res.get("name"), price)
        session.add(game)
        session.commit()
        session.refresh(game)
        return game
    else:
        return {"error": "Failed to fetch data"}
        
        

