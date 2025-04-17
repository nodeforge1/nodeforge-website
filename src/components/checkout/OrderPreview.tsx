import { ShoppingBag, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function OrderPreview() {
  const { items, getTotalPrice } = useCartStore();
  const shippingCost = 50; // Example shipping cost
  const totalWithShipping = getTotalPrice() + shippingCost;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingBag className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">Order Summary</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-4 border-b">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.config.software} - {item.config.ram} - {item.config.storage} - {item.config.processor}
              </p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${item.totalPrice}</p>
          </div>
        ))}

        <div className="flex justify-between py-4 border-b">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-400 mr-2" />
            <span>Shipping</span>
          </div>
          <p className="font-medium">${shippingCost}</p>
        </div>

        <div className="flex justify-between py-4">
          <span className="font-bold">Total</span>
          <p className="font-bold text-xl text-green-600">${totalWithShipping}</p>
        </div>
      </div>
    </div>
  );
}