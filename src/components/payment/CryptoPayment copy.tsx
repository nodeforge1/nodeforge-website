import { useState } from "react";
// import { useWeb3Modal } from '@web3modal/react';
// import { useAccount } from "wagmi";
//import DePay from '@depay/web3-payments';
import { Wallet } from "lucide-react";
import { retrieveSystemInfoAsText } from "../../utils/convert to plainaText";
import { useCartStore } from "../../store/cartStore";
// import { v4 as uuidv4 } from "uuid";
import { ShipmentFormData } from "./ShipmentDetails";

interface CryptoPaymentProps {
  amount: number;
  shippingDetails: ShipmentFormData | null;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CryptoPayment({
  amount,
  shippingDetails,
  onSuccess,
  onError,
}: CryptoPaymentProps) {
  const [invoice_url, setInvoiceUrl] = useState<{
    invoice_url: string;
    message: string;
    payment_id: string;
  }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice } = useCartStore();
  const [error, setError] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("eth"); // Default ETH

  const order_description = `${retrieveSystemInfoAsText(
    items
  )}Total Price: ${getTotalPrice()}`;
  // const order_id = uuidv4();y
console.log(selectedCurrency)
  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    setError(false);
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-crypto-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pay_currency: selectedCurrency, // Ensure consistency
            order_description,
            shippingInfo: {
              firstName: shippingDetails?.firstName || "",
              lastName: shippingDetails?.lastName || "",
              email: shippingDetails?.email || "",
              phone: shippingDetails?.phone || "",
              address: shippingDetails?.address || "",
              city: shippingDetails?.city || "",
              state: shippingDetails?.state || "",
              zipCode: shippingDetails?.zipCode || "",
              country: shippingDetails?.country || "",
            },
            line_items: [
              {
                price_data: {
                  product_data: { name: "Product Name" },
                  unit_amount: amount * 100,
                },
                quantity: 1,
              },
            ],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const text = await response.text();
      console.log("Raw Response:", text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("❌ Invalid JSON response:", text);
        throw new Error("Invalid JSON response from server");
      }
  
      console.log("✅ Crypto Payment Response:", data);
  
      if (data?.invoice_url) {
        setInvoiceUrl({
          invoice_url: data.invoice_url,
          message: "Redirecting to payment page",
          payment_id: data.id || "",
        });
        onSuccess();
      } else {
        throw new Error("Missing invoice_url in response");
      }
    } catch (err: any) {
      console.error("❌ Crypto Payment Error:", err);
      setError(true);
      onError(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold">Crypto Payment</h3>
        </div>
        <span className="text-xl font-bold">${amount}</span>
      </div>

      {/* {!isConnected && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Please connect your wallet to proceed with the payment
          </p>
        </div>
      )} */}

      {invoice_url?.invoice_url ? (
        <>
          <a
            target="_blank"
            href={`${invoice_url?.invoice_url}`}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            Continue
          </a>
          <span className="text-xs text-gray-500">
            you will be redirected to the payment page
          </span>
        </>
      ) : (
        <button
          onClick={handleCryptoPayment}
          disabled={isProcessing}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              <span>{"Pay with Crypto"}</span>
              {error && (
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75">
                  {invoice_url?.message}
                </span>
              )}
            </>
          )}
        </button>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <label>Select Cryptocurrency:</label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="ethbase">Base (ETH)</option>
          <option value="etharb">Arbitrum (ETH)</option>
        </select>
      </div>
    </div>
  );
}

