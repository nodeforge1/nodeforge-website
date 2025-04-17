import { useState } from 'react';
import { CreditCard, Building2 } from 'lucide-react';

interface PaymentMethodsProps {
  onSubmit: (method: string) => void;
  amount: number;
}

export default function PaymentMethods({ onSubmit }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState('credit-card');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">Payment Method</h2>
      </div>

      <div className="space-y-4">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="payment-method"
            value="credit-card"
            checked={selectedMethod === 'credit-card'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="h-4 w-4 text-green-500 focus:ring-green-500"
          />
          <div className="ml-4 flex items-center">
            <CreditCard className="h-6 w-6 text-gray-400 mr-2" />
            <div>
              <p className="font-medium">Credit Card</p>
              <p className="text-sm text-gray-500">Pay securely with your credit card</p>
            </div>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="payment-method"
            value="wire"
            checked={selectedMethod === 'wire'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="h-4 w-4 text-green-500 focus:ring-green-500"
          />
          <div className="ml-4 flex items-center">
            <Building2 className="h-6 w-6 text-gray-400 mr-2" />
            <div>
              <p className="font-medium">Wire Transfer</p>
              <p className="text-sm text-gray-500">Pay via bank wire transfer</p>
            </div>
          </div>
        </label>

        <button
          onClick={() => onSubmit(selectedMethod)}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <CreditCard className="h-5 w-5" />
          <span>Continue to Payment</span>
        </button>
      </div>
    </div>
  );
}