import { NextResponse } from "next/server";
import { GenresService } from "@/modules/genres/genres.service";

export async function GET() {
  try {
    const genres = await GenresService.getGenres();
    return NextResponse.json({ success: true, data: genres });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve genres" },
      { status: 500 }
    );
  }
}
