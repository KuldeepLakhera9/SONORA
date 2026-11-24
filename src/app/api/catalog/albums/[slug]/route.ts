import { NextResponse, type NextRequest } from "next/server";
import { AlbumsService } from "@/modules/albums/albums.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const album = await AlbumsService.getAlbumById(slug);

    if (!album) {
      return NextResponse.json(
        { success: false, error: "Album not found or not eligible for public display" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: album });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve album" },
      { status: 500 }
    );
  }
}
