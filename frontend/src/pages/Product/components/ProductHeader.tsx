import { Badge } from "../../../components/ui/badge";
import { Clock, Heart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { useState, useEffect } from "react";
import { formatTimeLeft } from "../../../utils/time";

interface ProductHeaderProps {
  title: string;
  categoryName: string;
  endTime: string; // ISO timestamp string
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

export function ProductHeader({
  title,
  categoryName,
  endTime,
  isWatchlisted,
  onToggleWatchlist,
}: ProductHeaderProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const endTimeMs = new Date(endTime).getTime();
      const timeLeftMs = Math.max(0, endTimeMs - Date.now());
      return formatTimeLeft(timeLeftMs);
    };

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl">{title}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleWatchlist}
          className={isWatchlisted ? "text-destructive" : ""}
        >
          <Heart className={`h-5 w-5 ${isWatchlisted ? "fill-red-500" : ""}`} />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Badge variant="secondary">{categoryName}</Badge>
        {timeLeft === "Auction ended" ? (
          <Badge variant="destructive">Auction Ended</Badge>
        ) : (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-accent" />
            <span>
              Ends in <span className="text-accent">{timeLeft}</span>
            </span>
          </div>
        )}
      </div>

      <Separator className="my-4" />
    </div>
  );
}
