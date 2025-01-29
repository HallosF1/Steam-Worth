from sqlalchemy.orm import Mapped, mapped_column
from db.database import Base, engine

class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    appid: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column( nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)

    def __init__(self, appid: int, name: str, price: float):
        self.appid = appid
        self.name = name
        self.price = float(price) / 100