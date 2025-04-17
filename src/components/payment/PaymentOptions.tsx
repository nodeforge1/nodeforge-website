import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet } from "lucide-react";
import CryptoPayment from "./CryptoPayment";
import ShipmentDetails, { ShipmentFormData } from "./ShipmentDetails";
import { useCartStore } from "../../store/cartStore";

interface PaymentOptionsProps {
  amount: number;
  onSuccess: () => void;
  // shipmentData: ShipmentFormData;
}

// Types based on your MongoDB schema
// type PaymentMethod = 'credit_card' | 'paypal' | 'crypto' | 'bank_transfer';
// type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
// type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

// interface ProductConfiguration {
//   software?: {
//     name: string;
//     price: number;
//   };
//   ram?: {
//     size: string;
//     price: number;
//   };
//   storage?: {
//     type: string;
//     price: number;
//   };
//   processor?: {
//     model: string;
//     price: number;
//   };
// }


// interface OrderItem {
//   productId: string;
//   name: string;
//   quantity: number;
//   basePrice: number;
//   configuration: ProductConfiguration;
//   image?: string;
//   warranty?: string;
// }

// interface Order {
//   orderID: string;
//   customer: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone?: string;
//   };
//   shippingInfo: {
//     address: string;
//     address2?: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   billingInfo: {
//     sameAsShipping: boolean;
//     address?: string;
//     address2?: string;
//     city?: string;
//     state?: string;
//     zipCode?: string;
//     country?: string;
//   };
//   products: OrderItem[];
//   subtotal: number;
//   shippingCost: number;
//   tax: number;
//   discount?: number;
//   totalPrice: number;
//   paymentMethod: PaymentMethod;
//   paymentStatus: PaymentStatus;
//   orderStatus: OrderStatus;
//   trackingInfo?: {
//     carrier?: string;
//     trackingNumber?: string;
//     trackingUrl?: string;
//     estimatedDelivery?: Date;
//   };
//   notes?: string;
//   stripe_session_id?: string;
//   metadata?: Record<string, any>;
// }

interface PaymentOptionsProps {
  amount: number;
  onSuccess: () => void;
}


export default function PaymentOptions({ amount, onSuccess }: PaymentOptionsProps) {
  // const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"selection" | "shipping" | "payment">("selection");
  const [shippingDetails, setShippingDetails] = useState<ShipmentFormData | null>(null);
  const { items, getTotalPrice } = useCartStore();

  const [selectedMethod, setSelectedMethod] = useState<"card" | "crypto" | null>(null);

  const products = items.map((item: any) => {
    return {
      productId: item._id,
      image: item.image,
      name: item.name,
      quantity: item.quantity,
      basePrice: item.totalPrice,
      warranty: "1year",
      configuration: item.config
    }
  })
  const customer = {
    firstName: shippingDetails?.firstName,
    lastName: shippingDetails?.lastName,
    phone: shippingDetails?.phone,
    email: shippingDetails?.email
  }

  const shippingInfo = {
    address: shippingDetails?.address,
    city: shippingDetails?.city,
    state: shippingDetails?.state,
    zipCode: shippingDetails?.zipCode,
    country: shippingDetails?.country
  }
  console.log(items);
  // const order_description = `${retrieveSystemInfoAsText(items)} Total Price: ${getTotalPrice()}`;

  const handleProceedToShipping = (method: "card" | "crypto") => {
    setSelectedMethod(method);
    setStep("shipping");
  };

  const handleShippingSubmit = (details: ShipmentFormData) => {
    setShippingDetails(details);
    setStep("payment");
  };

  const handleCardPayment = async () => {
    if (!shippingDetails) {
      alert("Please enter your shipping details before proceeding.");
      return;
    }

    setProcessing(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: `${Date.now().toString()}`,
          customer,
          shippingInfo,
          products,
          order_description: `${products.map((item: any) => {item.name, item.quantity}).join(", ")} Total Price: ${getTotalPrice()}`,
          billingInfo: {
            sameAsShipping: true,
          },

          subtotal: getTotalPrice(),
          shippingCost: 0,
          tax: 0,
          discount: 0,
          totalPrice: getTotalPrice(),

          paymentMethod: selectedMethod,
          paymentStatus: "pending",
          orderStatus: "Pending",
          trackingInfo: {
            carrier: "",
            trackingNumber: "",
            trackingUrl: "",
            estimatedDelivery: new Date(),
          },
          notes: "",
          stripe_session_id: "",

          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Product Name" },
                unit_amount: amount * 100,
              },
              quantity: 1,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      alert("An error occurred while processing the payment.");
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {step === "selection" && (
        <>
          {/* Payment Method Options */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProceedToShipping("card")}
              disabled={processing}
              className={`p-6 rounded-xl border-2 transition-colors ${selectedMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"
                }`}
            >
              <CreditCard className="h-8 w-8 mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Credit Card</h3>
              <p className="text-sm text-gray-600">Secure payment via Stripe</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProceedToShipping("crypto")}
              className={`p-6 rounded-xl border-2 transition-colors ${selectedMethod === "crypto" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-200"
                }`}
            >
              <Wallet className="h-8 w-8 mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Cryptocurrency</h3>
              <p className="text-sm text-gray-600">Pay with ETH via MetaMask</p>
            </motion.button>
          </div>
        </>
      )}

      {step === "shipping" && <ShipmentDetails onSubmit={handleShippingSubmit} />}

      {step === "payment" && (
        <AnimatePresence>
          {selectedMethod === "card" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCardPayment}
              disabled={processing}
              className="w-full p-4 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
              Proceed to Payment
            </motion.button>
          )}

          {selectedMethod === "crypto" && (
            <CryptoPayment
              amount={amount}
              shippingDetails={shippingDetails}
              shippingInfo={shippingInfo}
              customer={customer}
              productData={products}
              onSuccess={onSuccess}
              onError={() => alert("Crypto payment failed")}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
