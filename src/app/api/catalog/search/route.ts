import { NextResponse, type NextRequest } from "next/server";
import { SearchService } from "@/modules/search/search.service";
import { searchFilterSchema } from "@/modules/search/search.validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const validation = searchFilterSchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid search query parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const results = await SearchService.search(validation.data);
    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to execute catalog search" },
      { status: 500 }
    );
  }
}
