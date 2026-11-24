import { NextResponse, type NextRequest } from "next/server";
import { ArtistsService } from "@/modules/artists/artists.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const artist = await ArtistsService.getArtistById(slug);

    if (!artist) {
      return NextResponse.json(
        { success: false, error: "Artist not found or not eligible for public display" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: artist });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve artist" },
      { status: 500 }
    );
  }
}
