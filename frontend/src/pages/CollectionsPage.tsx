import axios from 'axios';
import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';

interface CollectionData {
  [folder: string]: {
    count: number;
    thumbnail?: string;
  };
}

function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionData>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get<CollectionData>(
          'http://localhost:8000/show/images/collections/',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setCollections(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-gray-600">Loading collections...</div>
      </div>
    );
  }

  if (error) {
    console.log("Run into an error: ", error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">Collections</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(collections).map(([folderName, { count, thumbnail }]) => {
          if (folderName.startsWith('.') || count === 0) return null;

          return (
            <CollectionCard
              key={folderName}
              title={folderName}
              count={count}
              thumbnail={thumbnail}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CollectionsPage;
