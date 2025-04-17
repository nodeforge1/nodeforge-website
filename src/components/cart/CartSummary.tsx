import PaymentButton from '../payment/PaymentButton';

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onClear: () => void;
}

export default function CartSummary({ total, itemCount, onClear }: CartSummaryProps) {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Items:</span>
        <span className="font-medium">{itemCount}</span>
      </div>
      <div className="flex justify-between text-lg font-bold mb-4">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={onClear}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear Cart
        </button>
        <PaymentButton amount={total} />
      </div>
    </div>
  );
}