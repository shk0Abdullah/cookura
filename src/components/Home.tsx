"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Home() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    // Validate query before hitting the backend
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col items-center pt-20 px-4">
      <div>
        <img src="/logo.png" alt="Cookura" className="h-64 w-auto" />
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading && <div className="mt-8 text-gray-600">Searching...</div>}

      {results.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result} className="p-3 bg-gray-50 rounded-lg">
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
}
