import { useState } from "react";
import { Settings, HardDrive, Cpu, ShoppingBag, Database } from "lucide-react";
import type { Product, NodeConfig } from "../types/index";
import { useCartStore } from "../store/cartStore";
import { calculatePrice } from "../utils/price";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [config, setConfig] = useState<NodeConfig>({
    software: "Dappnode",
    ram: product.specs.ram as NodeConfig["ram"],
    storage: product.specs.storage as NodeConfig["storage"],
    processor: product.specs.processor as NodeConfig["processor"],
  });

  const handleAddToCart = () => {
    addItem(product, config);
  };

  const price = product.price;
  const pricec = calculatePrice(price as number, config);
  console.log(pricec);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="space-y-4">
          {/* Software Selection */}
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-green-500" />
            <select
              value={config.software}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  software: e.target.value as NodeConfig["software"],
                }))
              }
              className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
            >
              {["Dappnode", "Stereum", "Sege", "Coincashew", "Blockops"].map(
                (software) => (
                  <option key={software} value={software}>
                    {software}
                  </option>
                )
              )}
            </select>
          </div>

          {/* RAM Selection */}
          <div className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-green-500" />
            <select
              value={config.ram}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  ram: e.target.value as NodeConfig["ram"],
                }))
              }
              className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
            >
              <option value="16GB">16GB RAM</option>
              <option value="32GB">32GB RAM (+$100)</option>
              <option value="64GB">64GB RAM (+$300)</option>
            </select>
          </div>

          {/* Storage Selection */}
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-green-500" />
            <select
              value={config.storage}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  storage: e.target.value as NodeConfig["storage"],
                }))
              }
              className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
            >
              <option value="2TB SSD">2TB SSD</option>
              <option value="4TB SSD">4TB SSD (+$200)</option>
            </select>
          </div>

          {/* Processor Selection */}
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-green-500" />
            <select
              value={config.processor}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  processor: e.target.value as NodeConfig["processor"],
                }))
              }
              className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
            >
              <option value="Intel i3">Intel i3</option>
              <option value="Intel i5">Intel i5 (+$150)</option>
              <option value="Intel i7">Intel i7 (+$300)</option>
            </select>
          </div>
        </div> 

        {/* Price and Add to Cart */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
