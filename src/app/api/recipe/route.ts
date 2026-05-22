import { type NextRequest, NextResponse } from "next/server";

interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
}

interface RecipeResponse {
  dishName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tips: string[];
}

const SYSTEM_PROMPT = `You are a professional recipe generator. When given a dish name or description, you MUST respond with ONLY a valid JSON object matching this exact schema (no markdown, no code fences, no extra text):

{
  "dishName": "string - the name of the dish",
  "description": "string - a brief appetizing description of the dish (2-3 sentences)",
  "prepTime": "string - preparation time e.g. '15 mins'",
  "cookTime": "string - cooking time e.g. '30 mins'",
  "servings": "number - number of servings",
  "ingredients": ["string - ingredient with quantity, e.g. '2 cups all-purpose flour'"],
  "instructions": ["string - numbered step instructions, be detailed but concise"],
  "tips": ["string - helpful cooking tips for this dish"]
}

Rules:
- Return ONLY the JSON object, nothing else
- Ingredients must include quantities and measurements
- Instructions should be clear, step-by-step, and detailed
- Tips should be practical and helpful
- Servings must be a number
- All strings must be properly escaped for valid JSON`;

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

    const groqApiKey = process.env.GROQ_API_KEY;
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 },
      );
    }

    const [groqResponse, unsplashResponse] = await Promise.allSettled([
      fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Generate a detailed recipe for: ${query}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" },
        }),
      }),
      unsplashAccessKey
        ? fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&content_filter=high`,
            {
              headers: {
                Authorization: `Client-ID ${unsplashAccessKey}`,
                "Accept-Version": "v1",
              },
            },
          )
        : Promise.resolve(null),
    ]);

    if (groqResponse.status === "rejected") {
      throw new Error("Groq API request failed");
    }

    const groqData = await groqResponse.value.json();

    if (!groqData.choices?.[0]?.message?.content) {
      throw new Error("No response from Groq API");
    }

    let recipe: RecipeResponse;
    try {
      recipe = JSON.parse(groqData.choices[0].message.content);
    } catch {
      throw new Error("Failed to parse recipe from Groq response");
    }

    let imageUrl: string | null = null;
    let photographer: string | null = null;

    if (unsplashResponse.status === "fulfilled" && unsplashResponse.value) {
      const unsplashData = await unsplashResponse.value.json();
      if (unsplashData.results?.length > 0) {
        const photo: UnsplashPhoto = unsplashData.results[0];
        imageUrl = photo.urls.regular;
        photographer = photo.user.name;
      }
    }

    return NextResponse.json({ recipe, imageUrl, photographer });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 },
    );
  }
}
