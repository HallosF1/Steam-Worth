import { NextResponse } from "next/server"


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const key = process.env.STEAM_API_KEY;
    
    if (!id) {
        return NextResponse.json({ error: "ID is insufficient" }, { status: 404 });
    }
    try {
        const accountSummary = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${id}`)
        const accountSummaryData = await accountSummary.json()
       
        const timeCreated = parseInt(accountSummaryData.response.players[0].timecreated.toString(), 10);
        const accountCreatedAt = new Date(timeCreated * 1000);
        const currentDate = new Date();
        const diffInMilli = currentDate.getTime() - accountCreatedAt.getTime();
        const diffInYears = diffInMilli / (1000 * 60 * 60 * 24 * 365.25);
        const accountAge = Math.floor(diffInYears);
        let visibility: string = "";
        switch (accountSummaryData.response.players[0].communityvisibilitystate) {
          case 0:
            visibility = "Offline";
            break;
          case 1:
            visibility = "Online";
            break;
          case 2:
            visibility = "Busy";
            break;
          case 3:
            visibility = "Away";
            break;
          case 4:
            visibility = "Snooze";
            break;
          case 5:
            visibility = "Looking to Trade";
            break;
          case 6:
            visibility = "Looking to Play";
            break;
          default:
            visibility = "Unknown";
        }
        const selectedFeatures = {
            avatar: accountSummaryData.response.players[0].avatarmedium,
            visibility: visibility,
            name: accountSummaryData.response.players[0].personaname,
            accountAge: accountAge 
        }
        return NextResponse.json({account: selectedFeatures}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, {status: 500})
    }
}
