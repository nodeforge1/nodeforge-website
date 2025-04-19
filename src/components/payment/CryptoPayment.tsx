import { useState } from "react";
import { Wallet, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
// import { retrieveSystemInfoAsText } from "../../utils/convert to plainaText";
import { useCartStore } from "../../store/cartStore";
import { ShipmentFormData } from "./ShipmentDetails";
// import QRCode from "react-qr-code";

interface CryptoPaymentProps {
  amount: number;
  shippingDetails: ShipmentFormData | null;
  productData: any;
  shippingInfo: any;
  customer: any
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CryptoPayment({
  amount,
  // shippingDetails,
  productData,
  shippingInfo,
  customer,
  onSuccess,
  onError,
}: CryptoPaymentProps) {
  const [paymentData, setPaymentData] = useState<{
    invoice_url: string;
    payment_address: string;
    payment_amount: string;
    payment_id: string;
  }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice } = useCartStore();
  const [error, setError] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("ethbase");
  const [showInstructions, setShowInstructions] = useState(false);

  // const order_description = `${retrieveSystemInfoAsText(
  //   items
  // )}Total Price: ${getTotalPrice()}`;

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    setError(false);

    const products = items.map((item: any) => {
      return {
        productId: item._id,
        image: item.image,
        name: item.name,
        quantity: item.quantity,
        basePrice: item.totalPrice,
        warranty: "1year",
        configuration: {
          software: item.config.software,
          ram: item.config.ram,
          storage: item.config.storage,
          processor: item.config.processor
        }
      }
    })

    try {

      // console.log(object)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-crypto-payment`,
        {
          // 'customer', 'products', 'totalPrice', 'paymentMethod'
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body:
            JSON.stringify({
              orderID: `${Date.now().toString()}`,
              customer,
              shippingInfo,
              products,
              pay_currency: selectedCurrency,
              order_description: `${productData.map((item: any) => { item.name, item.quantity }).join(", ")} Total Price: ${getTotalPrice()}`,
              billingInfo: {
                sameAsShipping: true,
              },

              subtotal: getTotalPrice(),
              shippingCost: 0,
              tax: 0,
              discount: 0,
              totalPrice: getTotalPrice(),

              paymentMethod: "crypto",
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
            }
          ),
        }
      );
      console.log(response)
      if (!response.ok) throw new Error(`Payment error: ${response.status}`);

      const data = await response.json();
      if (!data?.payment_id) throw new Error("Payment gateway error");

      setPaymentData(data);
      onSuccess();
    } catch (err: any) {
      console.error("Payment failed:", err);
      setError(true);
      onError(err.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrencySymbol = () => {
    switch (selectedCurrency) {
      case 'etharb': return 'ETH';
      default: return 'ethbase';
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wallet className="h-6 w-6 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">Crypto Payment</h3>
            <p className="text-sm text-gray-500">Secure blockchain transaction</p>
          </div>
        </div>
        <span className="text-xl font-bold">${amount.toFixed(2)}</span>
      </div>

      {/* Payment Instructions Toggle */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="w-full mb-4 text-sm text-green-600 hover:text-green-800 flex items-center"
      >
        {showInstructions ? "Hide instructions" : "How to pay with crypto?"}
        <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${showInstructions ? 'rotate-90' : ''}`} />
      </button>

      {showInstructions && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Crypto Payment Instructions
          </h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
            <li>Select your preferred cryptocurrency network</li>
            <li>Choose your payment method below</li>
            <li>You'll be redirected to the payment gateway</li>
            <li>Complete the payment process by copying the address / QR code or connect to your wallet</li>
            <li>Send the exact amount ({paymentData?.payment_amount || '...'} {getCurrencySymbol()})</li>
            <li>Wait for blockchain confirmation (usually 1-3 minutes)</li>
            <li>You'll receive confirmation email once processed</li>
          </ol>
        </div>
      )}

      {/* Currency Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Network
        </label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="ethbase">Base (ETH)</option>
          <option value="etharb">Arbitrum (ETH)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Gas fees vary by network. Base recommended for lowest fees.
        </p>
      </div>

      {/* Payment Options */}
      {paymentData ? (
        <div className="space-y-4">

          <div className="flex gap-3">
            <a
              href={paymentData.invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Wallet className="h-4 w-4" />
              <span>Proceed</span>
            </a>
            {/* <button
              onClick={() => setPaymentData(undefined)}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <span>Change Method</span>
            </button> */}
          </div>
        </div>
      ) : (
        <button
          onClick={handleCryptoPayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Generating Payment...</span>
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              <span>Generate Payment Details</span>
            </>
          )}
        </button>
      )}

      {/* Security Disclaimer */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700 flex items-start">
          <svg className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          All crypto payments are processed securely on-chain. We never store your wallet information.
        </p>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-50 rounded flex items-start text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
          <span>Payment failed. Please try again or contact support.</span>
        </div>
      )}
    </div>
  );
}