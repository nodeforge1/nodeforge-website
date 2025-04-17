import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface CreditCardFormProps {
  onSubmit: (paymentDetails: { paymentMethodId: string; orderDetails: any }) => Promise<void>;
}

export default function CreditCardForm({ onSubmit }: CreditCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      alert('Stripe has not loaded yet.');
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert('Card element not found.');
      setLoading(false);
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name,
        email,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await onSubmit({ paymentMethodId: paymentMethod.id, orderDetails: { email, name } });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
        <div className="border border-gray-300 rounded-lg p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  );
}
