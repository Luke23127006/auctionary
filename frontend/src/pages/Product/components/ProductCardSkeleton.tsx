import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Image Placeholder */}
      <div className="relative aspect-square bg-secondary">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title Placeholder */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Top Bidder Placeholder */}
        <div className="flex items-center gap-1 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          {/* Current Bid Row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Buy Now Row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Bids Count Row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
