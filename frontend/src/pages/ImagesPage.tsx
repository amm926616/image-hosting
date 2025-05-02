import { useEffect, useState } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';

interface ImageData {
  [folder: string]: string[];
}

function ImagesPage() {
  const [imageData, setImageData] = useState<ImageData>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImageLinks = async () => {
      try {
        const response = await axios.get<ImageData>(
          'http://localhost:8000/show/images/links/',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setImageData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch image links');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImageLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-gray-600">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">Image Gallery</h1>
      
      {Object.entries(imageData).map(([folderName, imageUrls]) => {
        if (folderName.startsWith('.') || imageUrls.length === 0) return null;
        
        return (
          <div key={folderName} className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
              {folderName.replace(/_/g, ' ')}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {imageUrls.map((imageUrl, index) => (
                <ImageCard key={index} src={imageUrl} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ImagesPage;