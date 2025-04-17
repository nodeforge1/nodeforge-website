import { CartItem as CartItemType } from '../../types';
import Cloudnary from '../cloudnary/Cloudnary';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export default function CartItem({ item, onRemove, onIncrement, onDecrement }: CartItemProps) {
  return (
    <div className="border-b py-4">
      <div className="flex gap-4">
        {/* Product Image */}
      <div className="w-20 h-20">
        <Cloudnary cldImg={item.image} format="auto" quality="auto" width={200} height={200} />
      </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{item?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {item?.config.software} • {item?.config.ram} RAM • {item?.config.storage} • {item?.config.processor}
              </p>
            </div>
            <p className="font-bold">${item?.totalPrice?.toFixed(2)}</p>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center mt-3 gap-4">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => onDecrement(item.id)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-1 min-w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onIncrement(item.id)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}