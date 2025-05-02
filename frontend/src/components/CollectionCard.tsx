import { useNavigate } from "react-router-dom";

function CollectionCard({
  title,
  count,
  thumbnail,
}: {
  title: string;
  count: number;
  thumbnail?: string;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collection/${encodeURIComponent(title)}`);
  };

  return (
    <div
      className="overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative bg-gray-100 h-48 flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://via.placeholder.com/300x200?text=Collection";
            }}
          />
        ) : (
          <div className="text-gray-400 text-5xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 truncate">{title}</h3>
        <p className="text-sm text-gray-500">{count} images</p>
      </div>
    </div>
  );
}

export default CollectionCard;
