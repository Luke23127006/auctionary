import { Button } from "../../../components/ui/button";
import { WatchlistCard } from "../../../components/auction/WatchlistCard";
import { useWatchlist } from "../../../hooks/useWatchlist";

export const WatchlistTab = () => {
  const { watchlist, isLoading } = useWatchlist();

  if (isLoading) {
    return <div>Loading watchlist...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">My Watchlist</h2>
          <p className="text-sm text-muted-foreground">
            {watchlist.length} items you're watching
          </p>
        </div>
        <Button variant="outline" disabled={watchlist.length === 0}>
          Clear All
        </Button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Your watchlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {watchlist.map((item) => (
            <WatchlistCard
              key={item.product_id}
              id={item.product_id}
              title={item.name}
              image={item.thumbnail_url}
              currentBid={Number(item.current_price)}
              timeLeft={new Date(item.end_time).toLocaleDateString()} // Simple formatting
              bidCount={item.bid_count}
              isActive={item.status === "active"}
            />
          ))}
        </div>
      )}
    </div>
  );
};
