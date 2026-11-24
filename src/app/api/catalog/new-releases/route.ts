import { NextResponse } from "next/server";
import { AlbumsService } from "@/modules/albums/albums.service";

export async function GET() {
  try {
    const newReleases = await AlbumsService.getNewReleases(8);
    return NextResponse.json({ success: true, data: newReleases });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve new releases" },
      { status: 500 }
    );
  }
}
