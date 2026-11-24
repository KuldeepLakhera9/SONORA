import { NextResponse, type NextRequest } from "next/server";
import { TracksService } from "@/modules/tracks/tracks.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const track = await TracksService.getTrackById(id);

    if (!track) {
      return NextResponse.json(
        { success: false, error: "Track not found or not eligible for public playback" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: track });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve track" },
      { status: 500 }
    );
  }
}
