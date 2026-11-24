import { NextResponse, type NextRequest } from "next/server";
import { ArtistsService } from "@/modules/artists/artists.service";

export async function GET() {
  try {
    const artists = await ArtistsService.getArtists();
    return NextResponse.json({ success: true, data: artists });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve artists" },
      { status: 500 }
    );
  }
}
