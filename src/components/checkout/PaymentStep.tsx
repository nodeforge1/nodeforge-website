import { motion } from 'framer-motion';
import PaymentOptions from '../payment/PaymentOptions';

interface PaymentStepProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentStep({ amount, onSuccess }: PaymentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Choose Payment Method</h2>
      <PaymentOptions amount={amount} onSuccess={onSuccess} />
    </motion.div>
  );
}