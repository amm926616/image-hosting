import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ImageCard from "../components/ImageCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useParams } from "react-router";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";

function CollectionDetailPage() {
  const { collectionName } = useParams<{ collectionName: string }>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!collectionName) {
      navigate("/");
      return;
    }

    const fetchImages = async () => {
      console.log("Fetching images for collection:", collectionName);
      try {
        const requestingUrl = `http://localhost:8000/show/images/links/${collectionName}`;
        setLoading(true);

        const response = await axios.get<{
          images: string[];
          has_next: boolean;
          total_images: number;
          current_page: number;
          total_pages: number;
        }>(requestingUrl, {
          params: { page },
          headers: {
            "Content-Type": "application/json",
          },
        });

        const imageArray = response.data.images;

        if (!Array.isArray(imageArray)) {
          throw new Error('Invalid response format: "images" is not an array');
        }

        if (page === 1) {
          setImageUrls(imageArray);
        } else {
          setImageUrls((prev) => [...prev, ...imageArray]);
        }

        setHasMore(response.data.has_next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch images");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [collectionName, page, navigate]);

  useEffect(() => {
    if (imageUrls.length > 0 && currentImageIndex >= imageUrls.length) {
      setCurrentImageIndex(0);
    }
  }, [imageUrls, currentImageIndex]);

  useEffect(() => {
    if (isViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isViewerOpen]);

  const startSlideshow = () => {
    setIsSlideshowActive(true);
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
    }
    slideshowIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 1500);
  };

  const stopSlideshow = () => {
    setIsSlideshowActive(false);
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }
  };

  const toggleSlideshow = () => {
    if (isSlideshowActive) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  };

  useEffect(() => {
    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isViewerOpen && isSlideshowActive) {
      stopSlideshow();
    }
  }, [isViewerOpen, isSlideshowActive]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const openViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  if (loading && page === 1) {
    return <LoadingSpinner />;
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
      >
        Back to Collections
      </button>

      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
        {collectionName?.replace(/_/g, " ")}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            onClick={() => openViewer(index)}
            className="cursor-pointer transition-transform transform hover:scale-105"
          >
            <ImageCard src={imageUrl} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {isViewerOpen &&
        imageUrls.length > 0 &&
        currentImageIndex < imageUrls.length && (
          <Lightbox
            mainSrc={imageUrls[currentImageIndex]}
            nextSrc={imageUrls[(currentImageIndex + 1) % imageUrls.length]}
            prevSrc={
              imageUrls[
                (currentImageIndex + imageUrls.length - 1) % imageUrls.length
              ]
            }
            onCloseRequest={() => setIsViewerOpen(false)}
            onMovePrevRequest={() => {
              stopSlideshow();
              setCurrentImageIndex(
                (currentImageIndex + imageUrls.length - 1) % imageUrls.length
              );
            }}
            onMoveNextRequest={() => {
              stopSlideshow();
              setCurrentImageIndex((currentImageIndex + 1) % imageUrls.length);
            }}
            toolbarButtons={[
              <button
                key="slideshow"
                className="lightbox-toolbar-button"
                onClick={toggleSlideshow}
                style={{
                  fontSize: '16px',
                  padding: '5px 10px',
                  background: isSlideshowActive ? '#f0f0f0' : 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              >
                {isSlideshowActive ? '⏸ Pause' : '▶ Slideshow'}
              </button>
            ]}
          />
        )}
    </div>
  );
}

export default CollectionDetailPage;
