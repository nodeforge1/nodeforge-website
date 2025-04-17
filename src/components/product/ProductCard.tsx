import {  useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { calculatePrice } from '../../utils/price';
import ProductOptions from './ProductOptions';
import Product3DView from './Product3DView';
import Cloudnary from '../cloudnary/Cloudnary';
import { calculateTotalPrice } from '../../utils/calculateTotalPrice';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  console.log(product)
  const [config, setConfig] = useState({
    software: product.specs.software,
    ram: product.specs.ram ,
    storage: product.specs.storage ,
    processor: product.specs.processor
  });
  const [show3D, setShow3D] = useState(false);

  const handleAddToCart = () => {
    addItem(product, config);
  };
  useEffect(() => {
    setConfig({
      software: product.specs.software,
      ram: product.specs.defaultSpecs.ram ,
      storage: product.specs.defaultSpecs.storage ,
      processor: product.specs.defaultSpecs.processor
    }); 
  }, [product])

  const price = calculatePrice(product.price, config);
  const totalPrice = calculateTotalPrice(product, config);

  console.log(product)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {show3D ? (
          <Product3DView />
        ) : (
          <div className="group">
            {/* <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-300" 
            /> */}
            <Cloudnary cldImg={product.image} format="auto" quality="auto" width={500} height={500} />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                {/* <div className="flex gap-2">
                  {[Server, Shield, Zap].map((Icon, i) => (
                    <div key={i} className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShow3D(!show3D)}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
        >
          <Eye className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <motion.div
        className="p-6"
        initial={false}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <ProductOptions config={config} onChange={setConfig} options={product.options}/>

        <div className="mt-6 flex items-center justify-between">
          <motion.span
            key={price}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-green-600"
          >
            ${totalPrice.toFixed(2)}
          </motion.span>
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 
                     transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}