import { NextRequest, NextResponse } from "next/server";

interface Game {
  appid: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const key = process.env.STEAM_API_KEY;
  
  if (!id) {
    console.log("insufficient ID");
  }

  try {
    const games = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&format=json`
    );
    const gamesData = await games.json();
    const gamesIDs: Array<Game> = gamesData.response.games;

    
    const requests = gamesIDs.map((game) =>
      fetch(`http://127.0.0.1:8000/games/${game.appid}`)
        .then(async (res) => {
          if (!res.ok) {
            console.error(`Error fetching details for appid ${game.appid}: HTTP ${res.status}`);
            return null;
          }
          const text = await res.text(); 
          try {
            return JSON.parse(text); 
          } catch (err) {
            console.error(`Error parsing JSON for appid ${game.appid}: ${err}`);
            return null;
          }
        })
    );
    
    const results = await Promise.all(requests);
    const validResults = results.filter((result) => result !== null);
    const total = validResults.reduce((sum, game) => {
      if (game?.price !== undefined) {
        return sum + game.price;
      }
      return sum;
    }, 0);
    
    console.log(total)

    return NextResponse.json(
      { gamesValue: total.toFixed(2) },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
