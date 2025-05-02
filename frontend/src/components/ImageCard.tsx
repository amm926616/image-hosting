import { useState } from "react";

function ImageCard({ src }: { src: string }) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative bg-gray-100 aspect-square">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={src}
          alt="Preview"
          className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
            setIsLoading(false);
          }}
        />
      </div>
      <div className="p-3 border-t border-gray-200">
        <p className="text-sm text-gray-600 truncate">{src.split('/').pop()}</p>
      </div>
    </div>
  );
}

export default ImageCard;