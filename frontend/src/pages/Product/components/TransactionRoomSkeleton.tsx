import { Skeleton } from "../../../components/ui/skeleton";
import { Card, CardContent } from "../../../components/ui/card";

export function TransactionRoomSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-4 w-96 ml-11" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Product Summary Skeleton */}
      <Card className="mb-8">
        <CardContent className="p-4 flex gap-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Stepper Skeleton */}
      <div className="flex justify-between mb-8 px-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Accordion Column */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Chat/Side Column */}
        <div className="lg:col-span-1 h-[600px] border rounded-lg p-4 flex flex-col">
          <div className="border-b pb-4 mb-4">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex justify-start">
              <Skeleton className="h-16 w-3/4 rounded-lg rounded-tl-none" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-1/2 rounded-lg rounded-tr-none" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-20 w-3/4 rounded-lg rounded-tl-none" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
