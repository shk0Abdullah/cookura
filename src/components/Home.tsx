"use client";

import Image from "next/image";
import { useState } from "react";
import RecipeCard from "./RecipeCard";
import SearchBar from "./SearchBar";

interface Recipe {
  dishName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tips: string[];
}

interface RecipeResult {
  recipe: Recipe;
  imageUrl: string | null;
  photographer: string | null;
}

export default function Home() {
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Recipe generation failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Recipe error:", err);
      setError("Failed to generate recipe. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4">
      <div className="mb-12">
        <Image
          src="/logo.png"
          alt="Cookura"
          className="h-64 w-auto"
          width={256}
          height={256}
        />
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Enter a dish name..." />

      {loading && (
        <div className="mt-8 text-gray-600 animate-pulse">
          Generating recipe...
        </div>
      )}

      {error && (
        <div className="mt-8 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {!loading && result && (
        <div className="mt-8 w-full max-w-4xl">
          <RecipeCard
            recipe={result.recipe}
            imageUrl={result.imageUrl}
            photographer={result.photographer}
          />
        </div>
      )}
    </div>
  );
}
