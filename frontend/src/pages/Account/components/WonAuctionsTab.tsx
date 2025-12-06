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
import { CheckCircle2, Clock } from "lucide-react";
import { useMyWonAuctions } from "../../../hooks/useMyWonAuctions";

export const WonAuctionsTab = () => {
  const { wonAuctions, isLoading } = useMyWonAuctions();

  if (isLoading) return <div>Loading won auctions...</div>;

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
                <TableRow key={auction.order_id}>
                  <TableCell>
                    <div className="text-sm">{auction.product_name}</div>
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
                      AUC-{auction.order_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    {auction.status === "completed" ? (
                      <Badge className="bg-success/20 text-success border-success/50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-accent/20 text-accent border-accent/50">
                        <Clock className="h-3 w-3 mr-1" />
                        {auction.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
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
