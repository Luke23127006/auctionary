import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";
import { useMyWonAuctions } from "../../../hooks/useMyWonAuctions";
import { useOtherUserWonAuctions } from "../../../hooks/useOtherUserWonAuctions";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { TableSkeleton } from "../../../components/common/TableSkeleton";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-success/20 text-success border-success/50">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
          <Truck className="h-3 w-3 mr-1" />
          Delivered
        </Badge>
      );
    case "payment_pending":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
          <Clock className="h-3 w-3 mr-1" />
          Payment Pending
        </Badge>
      );
    case "shipping_pending":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
          <Package className="h-3 w-3 mr-1" />
          Shipping Pending
        </Badge>
      );
    default:
      return (
        <Badge className="bg-accent/20 text-accent border-accent/50">
          <Clock className="h-3 w-3 mr-1" />
          {status.replace(/_/g, " ")}
        </Badge>
      );
  }
};

interface WonAuctionsTabProps {
  userId?: number;
}

export const WonAuctionsTab = ({ userId }: WonAuctionsTabProps = {}) => {
  const navigate = useNavigate();

  // Use different hooks based on whether viewing own or other user's auctions
  const ownAuctions = useMyWonAuctions();
  const otherAuctions = useOtherUserWonAuctions(userId!);

  const { wonAuctions, isLoading } = userId
    ? {
        wonAuctions: otherAuctions.auctions,
        isLoading: otherAuctions.isLoading,
      }
    : {
        wonAuctions: ownAuctions.wonAuctions,
        isLoading: ownAuctions.isLoading,
      };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl mb-1">Won Auctions</h2>
        <TableSkeleton columnCount={6} rowCount={5} />
      </div>
    );
  }

  if (wonAuctions.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl mb-1">Won Auctions</h2>
          <p className="text-sm text-muted-foreground">
            Your auction win history
          </p>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-medium">No auctions won yet</h3>
            <p className="mt-1 max-w-sm mx-auto">
              {userId
                ? "This user hasn't won any auctions yet."
                : "Keep bidding! Your future wins will appear here."}
            </p>
            {!userId && (
              <Button
                variant="link"
                onClick={() => navigate("/")}
                className="mt-2 text-accent"
              >
                Find auctions to bid on
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Won Auctions</h2>
          <p className="text-sm text-muted-foreground">
            Your auction win history
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Final Price</TableHead>
                <TableHead>Won Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wonAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <ImageWithFallback
                          src={auction.thumbnail_url || ""}
                          alt={auction.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm">{auction.product_name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-accent">
                      ${Number(auction.final_price).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(auction.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-muted-foreground">
                      AUC-{auction.id}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(auction.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/transactions/${auction.id}`)}
                    >
                      View Transaction
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
