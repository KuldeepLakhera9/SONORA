import { NextResponse } from "next/server";
import { TracksService } from "@/modules/tracks/tracks.service";

export async function GET() {
  try {
    const trending = await TracksService.getTrendingTracks(10);
    return NextResponse.json({ success: true, data: trending });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve trending tracks" },
      { status: 500 }
    );
  }
}
