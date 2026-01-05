import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handlePrevious = () => {
    changeImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    changeImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const changeImage = (getNewIndex: (prev: number) => number) => {
    setIsFading(true);
    setTimeout(() => {
      setSelectedIndex(getNewIndex);
      setIsFading(false);
    }, 200); // Fade duration
  };

  const startAutoPlay = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval (5 seconds)
    intervalRef.current = setInterval(() => {
      changeImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Auto-play effect
  useEffect(() => {
    // Only auto-play if there are multiple images and not hovering
    if (images.length > 1 && !isHovering) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    // Cleanup on unmount
    return () => {
      stopAutoPlay();
    };
  }, [images.length, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Auto-play will restart via useEffect with reset cooldown
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-secondary rounded-lg overflow-hidden border border-border group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`w-full h-full transition-opacity duration-200 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <ImageWithFallback
            src={images[selectedIndex]}
            alt={`Product image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                changeImage(() => index);
              }}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
