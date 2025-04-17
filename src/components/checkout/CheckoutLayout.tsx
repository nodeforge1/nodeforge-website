import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

export default function CheckoutLayout({ currentStep, children }: CheckoutLayoutProps) {
  const steps = [
    { icon: ShoppingBag, label: 'Shipping' },
    { icon: CreditCard, label: 'Payment' },
    { icon: CheckCircle, label: 'Confirmation' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;

                return (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive || isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <span className={`mt-2 text-sm ${
                        isActive ? 'text-green-500 font-medium' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-24 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}