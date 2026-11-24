import { NextResponse, type NextRequest } from "next/server";
import { AlbumsService } from "@/modules/albums/albums.service";
import { albumFilterSchema } from "@/modules/catalog/catalog.validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const validation = albumFilterSchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const result = await AlbumsService.getAlbums(validation.data);
    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve albums catalog" },
      { status: 500 }
    );
  }
}
