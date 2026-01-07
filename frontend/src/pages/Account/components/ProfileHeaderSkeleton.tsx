import { Skeleton } from "../../../components/ui/skeleton";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";

export function ProfileHeaderSkeleton() {
  return (
    <Card className="bg-card border-border mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Area */}
          <div className="relative">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background shadow-xl" />
            <Skeleton className="absolute bottom-0 right-0 h-6 w-6 rounded-full" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 md:border-l border-border md:pl-6">
            <div className="text-center space-y-1">
              <Skeleton className="h-8 w-8 mx-auto" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Separator
              orientation="vertical"
              className="h-10 hidden md:block"
            />
            <div className="text-center space-y-1">
              <Skeleton className="h-8 w-8 mx-auto" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Separator
              orientation="vertical"
              className="h-10 hidden md:block"
            />
            <div className="text-center space-y-1">
              <Skeleton className="h-8 w-8 mx-auto" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
