import { NextResponse } from "next/server";
import { TracksService } from "@/modules/tracks/tracks.service";

export async function GET() {
  try {
    const recentlyAdded = await TracksService.getNewReleases(10);
    return NextResponse.json({ success: true, data: recentlyAdded });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve recently added music" },
      { status: 500 }
    );
  }
}
