import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Check,
  Clock,
  Shield,
  Upload,
  X,
  Image as ImageIcon,
  PackageCheck,
  Info,
  Loader2,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import type { TransactionDetailResponse } from "../../../types/transaction";
import { formatTime } from "../../../utils/dateUtils";

type StepState = "completed" | "active-actor" | "active-observer" | "locked";

interface TransactionRoomShippingProps {
  mode: StepState;
  transaction: TransactionDetailResponse;
  isSeller: boolean;
  onShippingProof: (file: File) => void;
}

export function TransactionRoomShipping({
  mode,
  transaction,
  isSeller,
  onShippingProof,
}: TransactionRoomShippingProps) {
  const [shippingProof, setShippingProof] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    setShippingProof(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = () => {
    setShippingProof(null);
  };

  const handleSubmit = () => {
    if (shippingProof) {
      onShippingProof(shippingProof);
    }
  };

  // ============================================================================
  // COMPLETED STATE - Show read-only shipping confirmation
  // ============================================================================
  if (mode === "completed") {
    return (
      <div className="lg:col-span-2 space-y-6">
        {/* Completion Alert */}
        <Alert className="border-green-500/30 bg-green-500/5">
          <Shield className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm text-green-500/90">
            <strong>Shipping Confirmed:</strong> Package was shipped on{" "}
            {transaction.fulfillment.shippedConfirmedAt && formatTime(transaction.fulfillment.shippedConfirmedAt)}.
          </AlertDescription>
        </Alert>

        {/* Shipping Details Summary */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-green-500" />
                Package Shipped
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                <Check className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Shipped At</div>
                <div className="text-sm">
                  {transaction.fulfillment.uploadedAt && formatTime(transaction.fulfillment.uploadedAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Confirmed At</div>
                <div className="text-sm">
                  {transaction.fulfillment.shippedConfirmedAt && formatTime(transaction.fulfillment.shippedConfirmedAt)}
                </div>
              </div>
            </div>

            {/* Shipping Proof Image */}
            {transaction.fulfillment.proofUrl && (
              <div className="space-y-2">
                <Label>Shipping Proof</Label>
                <div className="relative rounded-lg overflow-hidden border-2 border-green-500/30">
                  <img
                    src={transaction.fulfillment.proofUrl}
                    alt="Shipping proof"
                    className="w-full h-auto max-h-96 object-contain bg-secondary"
                  />
                  <Badge className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        {transaction.shippingInfo.fullName && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="space-y-1 text-sm">
                  <div><strong>{transaction.shippingInfo.fullName}</strong></div>
                  <div>{transaction.shippingInfo.address}</div>
                  <div>{transaction.shippingInfo.city}</div>
                  <div>{transaction.shippingInfo.phoneNumber}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ============================================================================
  // ACTIVE-OBSERVER STATE - Waiting for the other party
  // ============================================================================
  if (mode === "active-observer") {
    // BUYER waiting for SELLER to ship
    if (!isSeller) {
      return (
        <div className="lg:col-span-2 space-y-6">
          <Alert className="border-accent/30 bg-accent/5">
            <Clock className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-accent/90">
              <strong>Payment Confirmed:</strong> Waiting for the seller to ship the item.
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
                  <h2 className="text-2xl">Waiting for Seller</h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    The seller is verifying your payment and preparing to ship the item. 
                    You'll be notified once the package is shipped.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                    <Check className="h-3 w-3 mr-1" />
                    Payment Confirmed
                  </Badge>
                  <Badge className="bg-accent/20 text-accent border-accent/50">
                    <Clock className="h-3 w-3 mr-1" />
                    Awaiting Shipment
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Confirmed */}
          {transaction.shippingInfo.fullName && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Your Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="space-y-1 text-sm">
                    <div><strong>{transaction.shippingInfo.fullName}</strong></div>
                    <div>{transaction.shippingInfo.address}</div>
                    <div>{transaction.shippingInfo.city}</div>
                    <div>{transaction.shippingInfo.phoneNumber}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    // SELLER in observer mode - waiting for buyer to provide address (edge case)
    return (
      <div className="lg:col-span-2 space-y-6">
        <Alert className="border-accent/30 bg-accent/5">
          <Clock className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm text-accent/90">
            <strong>Awaiting Address:</strong> Waiting for the buyer to provide shipping address.
          </AlertDescription>
        </Alert>

        <Card className="border-border">
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-accent" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-accent animate-spin" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl">Waiting for Shipping Address</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  The buyer needs to provide their shipping address before you can ship the item.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // ACTIVE-ACTOR STATE - User needs to take action
  // ============================================================================
  if (mode === "active-actor") {
    // SELLER VIEW - Confirm payment received and upload shipping proof
    if (isSeller) {
      return (
        <div className="lg:col-span-2 space-y-6">
          <Alert className="border-accent/30 bg-accent/5">
            <Shield className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-accent/90">
              <strong>Action Required:</strong> Confirm payment received and upload proof of shipment.
            </AlertDescription>
          </Alert>

          {/* Payment Proof from Buyer - Review Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                Buyer's Payment Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-border bg-secondary/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Please verify the payment proof before confirming. Make sure the amount matches.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">Amount to Verify</div>
                  <div className="text-3xl text-accent font-bold">${transaction.finalPrice.toFixed(2)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">Payment Uploaded At</div>
                  <div className="text-sm">
                    {transaction.payment.uploadedAt && formatTime(transaction.payment.uploadedAt)}
                  </div>
                </div>
              </div>

              {/* Payment Proof Image */}
              {transaction.payment.proofUrl && (
                <div className="space-y-2">
                  <Label>Payment Receipt</Label>
                  <div className="relative rounded-lg overflow-hidden border-2 border-accent">
                    <img
                      src={transaction.payment.proofUrl}
                      alt="Payment receipt"
                      className="w-full h-auto max-h-96 object-contain bg-secondary"
                    />
                    <Badge className="absolute bottom-2 left-2 bg-yellow-500/90 backdrop-blur border-0">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Awaiting Your Confirmation
                    </Badge>
                  </div>
                </div>
              )}

              {/* Payment Confirmation Checkbox */}
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-accent/30 bg-accent/5">
                <input
                  type="checkbox"
                  id="payment-confirmation"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-accent text-accent focus:ring-accent cursor-pointer"
                />
                <label htmlFor="payment-confirmation" className="flex-1 cursor-pointer">
                  <div className="font-medium text-accent mb-1">
                    Tôi xác nhận đã nhận đủ tiền
                  </div>
                  <div className="text-xs text-muted-foreground">
                    By checking this box, you confirm that you have received the full payment of ${transaction.finalPrice.toFixed(2)} from the buyer.
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {transaction.shippingInfo.fullName && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Buyer's Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Alert className="border-border bg-secondary/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Ship the item to this address and upload proof of shipment below.
                  </AlertDescription>
                </Alert>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="space-y-1 text-sm">
                    <div><strong>{transaction.shippingInfo.fullName}</strong></div>
                    <div>{transaction.shippingInfo.address}</div>
                    <div>{transaction.shippingInfo.city}</div>
                    <div>{transaction.shippingInfo.phoneNumber}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Shipping Proof */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent" />
                Upload Shipping Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-border bg-secondary/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Upload a photo of the shipping receipt or tracking number to proceed.
                </AlertDescription>
              </Alert>

              <div
                className={`relative border-2 border-dashed rounded-lg transition-all ${
                  dragActive
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50 hover:bg-accent/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="shipping-proof-upload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!!shippingProof}
                />
                <div className="p-8 text-center">
                  <div className="p-4 rounded-full bg-secondary/50 w-fit mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mb-2">
                    Drag and drop shipping receipt here, or{" "}
                    <span className="text-accent">click to browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</p>
                </div>
              </div>

              {shippingProof && (
                <div className="relative rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={URL.createObjectURL(shippingProof)}
                    alt="Shipping proof"
                    className="w-full h-auto max-h-96 object-contain bg-secondary"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 backdrop-blur text-white hover:bg-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Badge className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Receipt Uploaded
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button - Requires both conditions */}
          <Button
            className="w-full"
            size="lg"
            disabled={!shippingProof || !paymentConfirmed}
            onClick={handleSubmit}
          >
            <Check className="mr-2 h-5 w-5" />
            Confirm Payment & Shipment
          </Button>

          {(!shippingProof || !paymentConfirmed) && (
            <Alert className="border-yellow-500/30 bg-yellow-500/5">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-xs text-yellow-500/90">
                Please {!paymentConfirmed && "confirm payment received"}{!paymentConfirmed && !shippingProof && " and "}{!shippingProof && "upload shipping proof"} to continue.
              </AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    // BUYER VIEW - Provide shipping address (shouldn't happen in shipping step, handled in payment)
    return null;
  }

  // LOCKED STATE - Step not yet available
  return null;
}
