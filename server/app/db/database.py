from sqlalchemy import Column, Integer, String, create_engine, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///games.db"
engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, autoincrement=True, primary_key=True)
    appid = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)

    def __init__(self, appid: int, name: str, price: float):
        self.appid = appid
        self.name = name
        self.price = float(price) / 100

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)