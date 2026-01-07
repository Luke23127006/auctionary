import { Skeleton } from "../../../components/ui/skeleton";
import { Separator } from "../../../components/ui/separator";

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-12" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-24" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>

        {/* Right: Info & Bidding Skeleton */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          <Separator />

          {/* Seller Card */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Bidding Card */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-4 border-b">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4 max-w-3xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}
