import { NextResponse } from "next/server";
import { PlaylistsRepository } from "@/modules/playlists/playlists.repository";

export async function GET() {
  try {
    const playlists = await PlaylistsRepository.getPublicPlaylists();
    return NextResponse.json({ success: true, data: playlists });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve public playlists" },
      { status: 500 }
    );
  }
}
