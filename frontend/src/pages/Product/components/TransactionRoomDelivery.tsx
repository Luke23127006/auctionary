import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  Loader2,
  Clock,
  CircleCheck,
  PackageCheck,
} from "lucide-react";
import type { TransactionDetailResponse } from "../../../types/transaction";
import { formatTime } from "../../../utils/dateUtils";

type StepState = "completed" | "active-actor" | "active-observer" | "locked";

interface TransactionRoomDeliveryProps {
  mode: StepState;
  transaction: TransactionDetailResponse;
  isSeller: boolean;
  onConfirmReceipt: () => void;
  onReportIssue: () => void;
}

export function TransactionRoomDelivery({
  mode,
  transaction,
  isSeller,
  onConfirmReceipt,
  onReportIssue,
}: TransactionRoomDeliveryProps) {
  if (mode === "completed") {
    return (
      <div className="lg:col-span-2 space-y-6">
        <Alert className="border-green-500/30 bg-green-500/5">
          <CircleCheck className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Delivery Confirmed</AlertTitle>
          <AlertDescription className="text-sm text-success">
            Buyer confirmed receipt on{" "}
            {transaction.fulfillment.buyerReceivedAt &&
              formatTime(transaction.fulfillment.buyerReceivedAt)}
            .
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (mode === "active-observer" && isSeller) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <Alert className="border-accent/30 bg-accent/5">
          <Clock className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent">Package Delivered</AlertTitle>
          <AlertDescription className="text-sm text-accent">
            Waiting for buyer to confirm receipt.
          </AlertDescription>
        </Alert>
        <Card className="border-border">
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                  <PackageCheck className="h-16 w-16 text-accent" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-accent animate-spin" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl">Waiting for Buyer Confirmation</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  The package has been delivered. Waiting for the buyer to
                  confirm receipt and release the funds.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Shipped
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/50">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting Confirmation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "active-actor" && !isSeller) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle>Package Delivered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-accent/30 bg-accent/5">
              <Shield className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Important</AlertTitle>
              <AlertDescription className="text-sm text-accent">
                Once confirmed, funds will be released to the seller.
              </AlertDescription>
            </Alert>
            <Button className="w-full" size="lg" onClick={onConfirmReceipt}>
              <CheckCircle2 className="mr-2 h-6 w-6" />
              Confirm Receipt
            </Button>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive"
              onClick={onReportIssue}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
