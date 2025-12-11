import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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
  AlertCircle,
  CreditCard,
  MapPin,
  Shield,
  Info,
  DollarSign,
} from "lucide-react";

interface TransactionRoomProps {
  onSubmitAddress: () => void;
}

export function TransactionRoom({ onSubmitAddress }: TransactionRoomProps) {
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Address submitted:", addressForm);
    onSubmitAddress();
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Payment Alert */}
      <Alert className="border-accent/30 bg-accent/5">
        <Shield className="h-4 w-4 text-accent" />
        <AlertDescription className="text-sm text-accent/90">
          <strong>Escrow Protection Active:</strong> Your payment of $1,400 is
          secured in escrow. Funds will only be released to the seller after you
          confirm delivery.
        </AlertDescription>
      </Alert>

      {/* Payment Details */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />
              Payment Information
            </CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
              <AlertCircle className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Total Amount
              </div>
              <div className="text-xl text-accent">$1,400.00</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Escrow Fee
              </div>
              <div className="text-xl">$28.00</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Payment Method
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-xs text-white">
                  VISA
                </div>
                <span className="text-sm">•••• 4242</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div className="text-sm">Processing...</div>
            </div>
          </div>

          <Button className="w-full" size="lg">
            <DollarSign className="mr-2 h-5 w-5" />
            Complete Payment
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Address Form */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitAddress} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={addressForm.fullName}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    fullName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">
                Address Line 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addressLine1"
                placeholder="123 Main Street"
                value={addressForm.addressLine1}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    addressLine1: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                placeholder="Apartment, suite, etc."
                value={addressForm.addressLine2}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    addressLine2: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      state: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  ZIP Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={addressForm.zipCode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      zipCode: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <Alert className="border-border bg-secondary/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This address will be shared with the seller for shipping
                purposes only.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" size="lg">
              <Check className="mr-2 h-5 w-5" />
              Confirm Delivery Address
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
