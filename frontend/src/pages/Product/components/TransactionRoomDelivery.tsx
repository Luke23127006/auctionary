import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { CheckCircle2, AlertTriangle, Shield, Loader2 } from "lucide-react";
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

export function TransactionRoomDelivery({ mode, transaction, isSeller, onConfirmReceipt, onReportIssue }: TransactionRoomDeliveryProps) {
  if (mode === "completed") {
    return <div className="lg:col-span-2 space-y-6">
      <Alert className="border-green-500/30 bg-green-500/5">
        <Shield className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-sm text-green-500/90">
          <strong>Delivery Confirmed:</strong> Buyer confirmed receipt on {transaction.fulfillment.buyerReceivedAt && formatTime(transaction.fulfillment.buyerReceivedAt)}.
        </AlertDescription>
      </Alert>
    </div>;
  }

  if (mode === "active-observer" && isSeller) {
    return <div className="lg:col-span-2 space-y-6">
      <Alert className="border-green-500/30 bg-green-500/5">
        <Shield className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-sm text-green-500/90">
          <strong>Package Delivered:</strong> Waiting for buyer to confirm receipt.
        </AlertDescription>
      </Alert>
      <Card className="border-border">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <Loader2 className="h-16 w-16 text-accent animate-spin" />
            <h2 className="text-2xl">Waiting for Buyer Confirmation</h2>
          </div>
        </CardContent>
      </Card>
    </div>;
  }

  if (mode === "active-actor" && !isSeller) {
    return <div className="lg:col-span-2 space-y-6">
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle>Package Delivered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-accent/50 bg-accent/10">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertDescription>
              <strong>Important:</strong> Once confirmed, funds will be released to the seller.
            </AlertDescription>
          </Alert>
          <Button className="w-full" size="lg" onClick={onConfirmReceipt}>
            <CheckCircle2 className="mr-2 h-6 w-6" />
            Confirm Receipt
          </Button>
          <Button variant="outline" className="w-full border-destructive text-destructive" onClick={onReportIssue}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </CardContent>
      </Card>
    </div>;
  }

  return null;
}
