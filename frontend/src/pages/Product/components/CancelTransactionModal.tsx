import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface CancelTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function CancelTransactionModal({
  open,
  onOpenChange,
  onConfirm,
}: CancelTransactionModalProps) {
  const [reason, setReason] = useState("Buyer refused to pay...");
  const [error, setError] = useState("");

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent closing immediately

    if (!reason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    if (reason.length > 500) {
      setError("Reason cannot exceed 500 characters");
      return;
    }

    onConfirm(reason);
    setReason(""); // Reset for next time
    setError("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Transaction?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to cancel this transaction? This action
              cannot be undone.
            </p>
            <div className="space-y-2">
              <Label htmlFor="cancel-reason" className="text-foreground">
                Reason for Cancellation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Write your reason for cancellation here..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                className={error ? "border-red-500" : "border-border"}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <Alert
              variant="destructive"
              className="border-destructive bg-destructive/10"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning:</AlertTitle>
              <AlertDescription>
                Cancelling will result in a -1 rating for the buyer and may
                affect your seller reputation if abused.
              </AlertDescription>
            </Alert>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason("")}>
            No, Keep Transaction
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Cancel Transaction
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
