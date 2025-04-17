import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function Cart() {
  const { items, removeItem, getTotalPrice, clearCart, incrementQuantity, decrementQuantity } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleClearCart = () => {
    clearCart();
    // Optional: Add confirmation toast/message
  };
  console.log(items)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-white hover:text-green-400 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 sm:top-0 top-24 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="relative bg-white w-full h-full sm:w-full sm:max-w-4xl sm:max-h-[90vh] sm:rounded-xl shadow-2xl flex flex-col sm:h-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <ShoppingCart className="h-20 w-20 text-gray-300 mb-6" />
                  <p className="text-gray-500 text-xl mb-6">Your cart is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItem 
                        key={`${item.id}-${JSON.stringify(item.config)}`}
                        item={item} 
                        onIncrement={() => incrementQuantity(item.id)}
                        onDecrement={() => decrementQuantity(item.id)}
                        onRemove={() => removeItem(item.id)}
                      />
                    ))}
                  </div>
                  
                  {/* Sticky Footer */}
                  <div className="sticky bottom-0 bg-white pt-6 border-t -mx-6 px-6">
                    <CartSummary
                      total={getTotalPrice()} 
                      itemCount={items.reduce((total, item) => total + item.quantity, 0)}
                      onClear={handleClearCart}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}