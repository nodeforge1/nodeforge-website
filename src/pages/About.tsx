import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Server, Shield, Recycle, Cpu, Users, Globe, Leaf,  Zap } from 'lucide-react';

export default function About() {


  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [visionRef, visionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="bg-gray-50">
      {/* Animated Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ y: Math.random() * 100 }}
              animate={{ 
                y: [Math.random() * 100, Math.random() * -100],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full opacity-20"></div>
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-green-400">NODEFORGE</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            NodeForge is a platform where cutting-edge technology meets sustainability and decentralization. We make it easy for users to buy and deploy blockchain nodes, empowering communities through access to decentralized infrastructure. Our mission is to promote transparency, equity, and resilience by enabling sustainable participation in the decentralized future.</p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section with Enhanced Content */}
      <section className="py-20" ref={missionRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <div className="w-20 h-1 bg-green-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our mission is to build a truly inclusive and accessible ecosystem that empowers anyone—regardless of their location, background, or technical expertise—to operate their own Ethereum node. By lowering the barriers to entry through innovative, energy-efficient, and cost-effective hardware solutions, we strive to decentralize the Ethereum network further, enhance security, and increase community participation. At the heart of our mission lies a deep commitment to environmental sustainability, blockchain adoption, and open access to decentralized technologies that shape the future of the internet.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={missionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Zap className="h-6 w-6 text-green-500 mr-2" />
                    Decentralization for All
                  </h3>
                  <p className="text-gray-600">
                  We're on a mission to democratize access to decentralized infrastructure by removing the traditional technical and financial barriers that have limited participation. Our plug-and-play node solutions—starting at just $199—are designed for everyone, from crypto enthusiasts to complete beginners. With no prior technical knowledge required, we empower users to actively participate in blockchain networks, contribute to decentralization, and earn rewards, all with ease and confidence. This is decentralization made simple, accessible, and inclusive.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={missionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Leaf className="h-6 w-6 text-green-500 mr-2" />
                    Sustainable Blockchain
                  </h3>
                  <p className="text-gray-600">
                  At the heart of our commitment to sustainability is a carbon-neutral refurbishment process that extends the lifecycle of enterprise-grade hardware. Instead of contributing to the growing global e-waste crisis, we breathe new life into existing equipment—reducing electronic waste by up to 60% compared to the production and use of brand-new devices. By integrating these refurbished systems into our blockchain infrastructure, we not only lower our environmental footprint but also promote a more circular, resource-efficient economy that aligns with the values of decentralization, responsibility, and long-term impact.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "99.9%", label: "Node Uptime", icon: Shield },
              { value: "60%", label: "E-Waste Reduction", icon: Recycle },
              { value: "12+", label: "Countries Served", icon: Globe }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="bg-green-700/30 p-6 rounded-xl">
                  <stat.icon className="h-10 w-10 mx-auto mb-4" />
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-lg">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Why Choose NODEFORGE?</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mb-16"></div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Quality Assured",
                  description: "Every system undergoes 72-hour stress tests for performance and stability",
                  features: ["99.9% uptime guarantee", "Enterprise-grade hardware", "1-year warranty"]
                },
                {
                  icon: Recycle,
                  title: "Eco-Friendly",
                  description: "Professional refurbishment with carbon-neutral shipping",
                  features: ["60% less e-waste", "Energy-efficient components", "Recycling program"]
                },
                {
                  icon: Server,
                  title: "Expert Configuration",
                  description: "Pre-loaded with your choice of client software",
                  features: ["Geth/Nethermind/Besu", "Optimized sync settings", "24/7 support"]
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                >
                  <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">{value.title}</h3>
                  <p className="text-gray-600 text-center mb-6">{value.description}</p>
                  <ul className="space-y-2">
                    {value.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white" ref={visionRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <div className="w-20 h-1 bg-green-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              We envision a world where blockchain technology—particularly Ethereum—is truly decentralized, secure, and accessible to everyone. A world where participation in securing and maintaining the network isn’t limited to a few, but open to all.
By empowering individuals and communities across the globe to run their own nodes, we strengthen the fabric of decentralization, enhance network security, and ensure long-term sustainability.
We believe that the future of Ethereum depends on a diverse and distributed ecosystem of node operators, and we're committed to making that vision a reality by lowering barriers, raising awareness, and providing the tools and education needed to foster active participation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Global Access",
                  description: "Making node operation accessible worldwide",
                  details: ["Starter kits from $199", "Local partners in 12+ countries", "Multilingual support"]
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Building a strong network of node operators",
                  details: ["Decentralized forum", "Grants program", "Node operator meetups"]
                },
                {
                  icon: Cpu,
                  title: "Innovation",
                  description: "Continuously improving our solutions",
                  details: ["Modular hardware upgrades", "R&D lab", "ZK-proof integration research"]
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-green-400 transition-colors"
                >
                  <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-center mb-6">{item.description}</p>
                  <ul className="space-y-3">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Join the Decentralized Future?</h2>
            <p className="text-lg text-gray-600 mb-8">
            Whether you're a passionate individual exploring the power of decentralization or a forward-thinking enterprise seeking scalable, secure infrastructure — we offer tailored node solutions designed to meet your needs. Our platform empowers you to participate in the decentralized economy, enhance transparency, and take control of your digital assets with ease and confidence. Step into the future where ownership, resilience, and innovation converge.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Explore Hardware
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Join Our Community
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}