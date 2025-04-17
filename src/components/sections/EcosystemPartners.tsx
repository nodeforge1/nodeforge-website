import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function EcosystemPartners() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // const partners = [
  //   // Your partner data remains the same
  //   {
  //     name: "Ethereum",
  //     logo: "https://pbs.twimg.com/profile_images/1878738447067652096/tXQbWfpf_400x400.jpg",
  //     description: "The foundation of decentralized computing"
  //   },
  //   // ... other partners
  // ];

  // Grid animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
            Powering All Major Blockchain Networks

          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our high-performance node hardware is optimized to support and run leading blockchain protocols such as Ethereum, Solana, BNB Chain, Polygon, Avalanche, and more. Deploy, validate, and scale effortlessly across top networks with hardware you can rely on.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : ""}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={item}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-green-400 transition-all group relative overflow-hidden"
            >
              {/* Hover effect background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 0.5 }}
              />

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-green-400/10 group-hover:bg-green-400/20 transition-all duration-500 rounded-2xl" />
              </div>

              <div className="relative z-10 w-24 h-24 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <motion.img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-w-full max-h-full object-contain rounded-full"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>

              <h3 className="text-xl font-semibold text-center mb-3 text-white group-hover:text-green-400 transition-colors">
                {partner.name}
              </h3>

              <motion.p
                className="text-sm text-gray-400 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {partner.description}
              </motion.p>

              {/* Connection lines animation */}
              {index < partners.length - 1 && (
                <motion.div
                  className="hidden xl:block absolute right-0 top-1/2 translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView ? 1 : 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-green-400/20"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: [Math.random() * 100, Math.random() * 100],
                y: [Math.random() * 100, Math.random() * 100],
                opacity: [0, 0.3, 0],
                scale: [0, Math.random() * 0.5 + 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
const partners = [
  {
    name: "Ethereum",
    logo: "https://pbs.twimg.com/profile_images/1878738447067652096/tXQbWfpf_400x400.jpg",
    description: "The foundation of decentralized computing"
  },
  {
    name: "Optimism",
    logo: "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Profile-Logo.svg",
    description: "Layer 2 scaling solution"
  },
  {
    name: "Base",
    logo: "https://pbs.twimg.com/profile_images/1840800810571350019/1pCjLY5q_400x400.jpg",
    description: "The secure blockchain for everyone"
  },
  {
    name: "Lido",
    logo: "https://pbs.twimg.com/profile_images/1721880644345622528/G2czctJJ_400x400.jpg",
    description: "Liquid staking protocol"
  },
  {
    name: "Polygon",
    logo: "https://pbs.twimg.com/profile_images/1881552782148206592/uL2NdckM_400x400.jpg",
    description: "All things Polygon, run by Polygon Labs."
  },

  {
    name: "EtherFi",
    logo: "https://pbs.twimg.com/profile_images/1615130604328161281/FgQYpAa2_400x400.jpg",
    description: "Decentralized staking platform"
  },
  {
    name: "Arbitrum",
    logo: "https://pbs.twimg.com/profile_images/1882673922400776192/niCbzDud_400x400.jpg",
    description: "An onchain ecosystem for all. Innovate apps and chains your own way."
  },
  {
    name: "Starknet",
    logo: "https://pbs.twimg.com/profile_images/1834202903189618688/N4J8emeY_400x400.png",
    description: "Shaping the future with scale and integrity."
  },
  {
    name: "ZKsync",
    logo: "https://pbs.twimg.com/profile_images/1835668010951950336/Aq1Kg1p0_400x400.jpg",
    description: "The Elastic Network: an ever expanding verifiable blockchain network, secured by math. Built on Ethereum."
  },

  {
    name: "Cartesi",
    logo: "https://pbs.twimg.com/profile_images/1680833512864370688/sba50CAW_400x400.jpg",
    description: "Linux-powered rollups: The simple way to build in web3. Join the community"
  },
  {
    name: "Obol",
    logo: "https://pbs.twimg.com/profile_images/1808892465409122304/v_aRUEwp_400x400.jpg",
    description: "Scaling infrastructure networks with the largest Decentralized Operator Ecosystem in Ethereum and Web3, powered by distributed validators."
  },
  {
    name: "Celo",
    logo: "https://pbs.twimg.com/profile_images/1613170131491848195/InjXBNx9_400x400.jpg",
    description: "Celo is now a Layer 2. Secured by Ethereum. Built different."
  }
];