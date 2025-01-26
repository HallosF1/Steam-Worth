import { NextRequest, NextResponse } from 'next/server';

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vanityUrl = searchParams.get('vanityurl');

  if (!vanityUrl) {
    return NextResponse.json({ error: "Vanity URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`
    );
    const data = await response.json();

    if (!response.ok || !data.response) {
      return NextResponse.json({ error: "Failed to resolve Vanity URL" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
