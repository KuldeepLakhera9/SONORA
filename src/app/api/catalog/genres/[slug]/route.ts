import { NextResponse, type NextRequest } from "next/server";
import { GenresService } from "@/modules/genres/genres.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const genre = await GenresService.getGenreBySlug(slug);

    if (!genre) {
      return NextResponse.json(
        { success: false, error: "Genre not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: genre });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve genre" },
      { status: 500 }
    );
  }
}
