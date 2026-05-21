import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    // This is the procedure that handles the search
    const results = await searchDishes(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// The procedure that searches for dishes
async function searchDishes(query: string): Promise<string[]> {
  // TODO: Implement actual search logic here
  // This could query a database, call an external API, etc.

  // Placeholder implementation
  return [
    `Dish matching "${query}" - Result 1`,
    `Dish matching "${query}" - Result 2`,
    `Dish matching "${query}" - Result 3`,
  ];
}
