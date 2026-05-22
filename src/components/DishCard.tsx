import Image from "next/image";

interface DishCardProps {
  imageUrl: string;
  description: string;
  photographer: string;
}

export default function DishCard({
  imageUrl,
  description,
  photographer,
}: DishCardProps) {
  return (
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-64">
      <div className="w-1/2 p-6 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-800 capitalize mb-3">
          {description}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          A delightful dish prepared with fresh ingredients and traditional
          techniques. This recipe brings together aromatic spices and wholesome
          flavors, creating a memorable dining experience that celebrates
          culinary craftsmanship and seasonal produce.
        </p>
        <p className="text-xs text-gray-400">
          Photo by {photographer} via Unsplash
        </p>
      </div>
      <div className="w-px bg-gray-200" />
      <div className="w-1/2 relative">
        <Image
          src={imageUrl}
          alt={description}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
