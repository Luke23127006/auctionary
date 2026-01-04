import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Check, Copy, XCircle } from "lucide-react";
import { CancelTransactionModal } from "./CancelTransactionModal";

interface TransactionRoomHeaderProps {
  statusBadge: {
    icon: React.ElementType;
    text: string;
    className: string;
  };
  description: string;
  transactionId: string;
  isSeller: boolean;
  currentScreen: string;
  onCancelTransaction: (reason: string) => void;
}

export function TransactionRoomHeader({
  statusBadge,
  description,
  transactionId,
  isSeller,
  currentScreen,
  onCancelTransaction,
}: TransactionRoomHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelConfirm = (reason: string) => {
    onCancelTransaction(reason);
    setCancelDialogOpen(false);
  };

  const StatusIcon = statusBadge.icon;
  const showCancelButton =
    isSeller &&
    currentScreen !== "transaction-room-complete" &&
    currentScreen !== "cancelled";

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">Transaction Room</h1>
            <Badge className={statusBadge.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusBadge.text}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Transaction ID:</span>
            <code className="px-2 py-1 rounded bg-secondary border border-border font-mono text-xs">
              {transactionId}
            </code>
            <Button variant="ghost" size="sm" onClick={handleCopyTransactionId}>
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {showCancelButton && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setCancelDialogOpen(true)}
            className="ml-4"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Transaction
          </Button>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <CancelTransactionModal
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}
