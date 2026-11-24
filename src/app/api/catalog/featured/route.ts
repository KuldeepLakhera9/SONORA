import { NextResponse } from "next/server";
import { TracksService } from "@/modules/tracks/tracks.service";

export async function GET() {
  try {
    const featured = await TracksService.getFeaturedTracks(6);
    return NextResponse.json({ success: true, data: featured });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve featured music" },
      { status: 500 }
    );
  }
}
