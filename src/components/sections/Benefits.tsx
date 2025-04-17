import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Lock, Coins, Clock } from 'lucide-react';

export default function Benefits() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const benefits = [
    {
      icon: Zap,
      title: "High Performance",
      description: "Optimized hardware configuration ensures smooth node operation"
    },
    {
      icon: Lock,
      title: "Enhanced Security",
      description: "Pre-configured security settings to protect your node"
    },
    {
      icon: Coins,
      title: "Cost Effective",
      description: "Save on hardware costs with our refurbished solutions"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance for your node"
    }
  ];

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Benefits of Choosing NODEFORGE
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the advantages of running your Ethereum node with our solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-green-500/10 p-3 rounded-lg">
                <benefit.icon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}