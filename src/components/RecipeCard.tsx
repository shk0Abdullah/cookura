import Image from "next/image";

interface RecipeCardProps {
  recipe: {
    dishName: string;
    description: string;
    prepTime: string;
    cookTime: string;
    servings: number;
    ingredients: string[];
    instructions: string[];
    tips: string[];
  };
  imageUrl: string | null;
  photographer: string | null;
}

export default function RecipeCard({
  recipe,
  imageUrl,
  photographer,
}: RecipeCardProps) {
  return (
    <div className="flex bg-yellow-50 rounded-xl shadow-md overflow-hidden border-2 border-yellow-300 min-h-[400px]">
      <div className="w-1/2 p-6 flex flex-col justify-start overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 capitalize mb-1">
          {recipe.dishName}
        </h2>
        <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>

        <div className="flex gap-4 mb-4 text-sm">
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium">
            Prep: {recipe.prepTime}
          </span>
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium">
            Cook: {recipe.cookTime}
          </span>
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium">
            Serves: {recipe.servings}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient} className="text-gray-700 text-sm">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions.map((step) => (
              <li key={step} className="text-gray-700 text-sm leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {recipe.tips.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tips</h3>
            <ul className="space-y-1">
              {recipe.tips.map((tip) => (
                <li key={tip} className="text-gray-600 text-sm flex gap-2">
                  <span className="text-yellow-500">&#9733;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-px bg-yellow-300" />

      <div className="w-1/2 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.dishName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-yellow-100">
            <span className="text-yellow-400 text-lg">No image available</span>
          </div>
        )}
        {photographer && (
          <p className="absolute bottom-2 right-2 text-xs text-white bg-black/40 px-2 py-1 rounded">
            Photo by {photographer} via Unsplash
          </p>
        )}
      </div>
    </div>
  );
}
