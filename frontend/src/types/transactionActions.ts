export interface PaymentSubmitData {
  paymentProof: File;
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
}

export interface ShippingSubmitData {
  shippingProof: File;
  paymentConfirmed: boolean;
}

export interface DeliveryConfirmData {
  received: boolean;
}

export interface ReviewSubmitData {
  rating: 1 | -1;
  comment: string;
}

export interface CancelTransactionData {
  reason: string;
}
