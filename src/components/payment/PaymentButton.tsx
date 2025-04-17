import { useState } from 'react';
import PaymentOptions from './PaymentOptions';

interface PaymentButtonProps {
  amount: number;
  // orderDetails: any;
}

export default function PaymentButton({ amount }: PaymentButtonProps) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  if (showPaymentOptions) {
    return <PaymentOptions amount={amount} onSuccess={() => console.log('Payment Successful')} />;
  }

  return (
    <button
      onClick={() => setShowPaymentOptions(true)}
      className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
    >
      Proceed to Payment
    </button>
  );
}
