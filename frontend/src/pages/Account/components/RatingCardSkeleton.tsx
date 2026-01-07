import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export function RatingCardSkeleton() {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar Skeleton */}
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Comment */}
            <Skeleton className="h-12 w-full rounded-lg" />

            {/* Product Info */}
            <div className="flex items-center gap-3 p-2 rounded-lg border border-border">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
