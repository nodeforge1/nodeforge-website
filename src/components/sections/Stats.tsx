import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface StatItem {
  value: string;
  label: string;
  isNumber?: boolean;
  maxValue?: number;
  suffix?: string;
}

export default function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const controls = useAnimation();
  const [countStarted, setCountStarted] = useState(false);

  const stats: StatItem[] = [
    { value: "50", label: "Nodes Deployed", isNumber: true, maxValue: 50 },
    { value: "99.9", label: "Uptime", isNumber: true, maxValue: 99.9, suffix: "%" },
    { value: "24/7", label: "Support" },
    { value: "7", label: "Countries Served", isNumber: true, maxValue: 7 }
  ];

  // Start counting when component is in view
  useEffect(() => {
    if (inView && !countStarted) {
      setCountStarted(true);
      controls.start("visible");
    }
  }, [inView, controls, countStarted]);

  // Animation variants for counting
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                {stat.isNumber ? (
                  <Counter 
                    from={0} 
                    to={stat.maxValue!} 
                    suffix={stat.suffix} 
                    duration={1.5} 
                    decimals={stat.value.includes('.') ? 1 : 0}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <motion.div 
                className="text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Counter component for the counting animation
const Counter = ({ from, to, suffix = '', duration = 2, decimals = 0 }:any) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const currentValue = Math.floor(progress * (to - from) + from);
      setCount(parseFloat(currentValue.toFixed(decimals)));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [from, to, duration, decimals]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};