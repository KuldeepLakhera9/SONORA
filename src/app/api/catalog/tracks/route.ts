import { NextResponse, type NextRequest } from "next/server";
import { TracksService } from "@/modules/tracks/tracks.service";
import { trackFilterSchema } from "@/modules/catalog/catalog.validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const validation = trackFilterSchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const result = await TracksService.getTracks(validation.data);
    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve tracks catalog" },
      { status: 500 }
    );
  }
}
