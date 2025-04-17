import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Server, Shield, Zap, Cpu, HardDrive, 
  Settings, Cloud, Clock, DollarSign 
} from 'lucide-react';

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: Server,
      title: "Pre-configured Nodes",
      description: "Ready to run out of the box with optimized settings",
      color: "green"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced security measures to protect your node",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Energy Efficient",
      description: "Minimized power consumption for sustainable operation",
      color: "yellow"
    },
    {
      icon: Cpu,
      title: "Powerful Hardware",
      description: "High-performance components for reliable validation",
      color: "purple"
    },
    {
      icon: HardDrive,
      title: "Optimized Storage",
      description: "Fast SSDs configured for blockchain data",
      color: "red"
    },
    {
      icon: Settings,
      title: "Easy Management",
      description: "User-friendly interface for node monitoring",
      color: "indigo"
    },
    {
      icon: Cloud,
      title: "Remote Access",
      description: "Secure remote management capabilities",
      color: "pink"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance",
      color: "orange"
    },
    {
      icon: DollarSign,
      title: "Cost Effective",
      description: "Affordable solutions without compromising quality",
      color: "teal"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Complete Node Solutions
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to run a professional Ethereum node
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group bg-gray-800 p-8 rounded-xl hover:bg-gray-700 
                       transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`bg-green-500/10 w-16 h-16 rounded-xl 
                            flex items-center justify-center mb-6 
                            group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`h-8 w-8 text-green-400`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}