import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShipmentDetails from '../components/payment/ShipmentDetails';
import PaymentMethods from '../components/checkout/PaymentMethods';
import OrderPreview from '../components/checkout/OrderPreview';
import { useCartStore } from '../store/cartStore';
// import type { ShipmentFormData } from '../types';

export default function Checkout() {
  const [step, setStep] = useState(1);
  // const [shippingDetails, setShippingDetails] = useState<ShipmentFormData | null>(null);
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    navigate('/products');
    return null;
  }

  const handleShipmentSubmit = () => {
    // setShippingDetails(data);
    setStep(2);
  };

  const handlePaymentSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearCart();
      setStep(3);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {step === 1 && (
                  <ShipmentDetails onSubmit={handleShipmentSubmit} />
                )}
                {step === 2 && (
                  <PaymentMethods 
                    onSubmit={handlePaymentSubmit}
                    amount={getTotalPrice()}
                  />
                )}
                {step === 3 && (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-8">
                      Thank you for your order. We'll send you a confirmation email shortly.
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Return to Home
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="lg:w-96">
              <div className="sticky top-24">
                <OrderPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}