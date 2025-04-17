import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Server, Wallet, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqCategories = [
    {
      id: 'general',
      name: 'General',
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: "What is NodeForge?",
          answer: "NodeForge is a platform providing enterprise-grade blockchain infrastructure solutions, specializing in Ethereum nodes and validator hardware. We offer pre-configured systems and expert support for running nodes at scale."
        },
        {
          question: "Who should use NodeForge services?",
          answer: "Our solutions are ideal for developers, enterprises, staking services, and anyone needing reliable blockchain infrastructure. Whether you're running a single validator or managing thousands of nodes, we have solutions to match your needs."
        },
        {
          question: "How does NodeForge differ from cloud providers?",
          answer: "Unlike generic cloud providers, we specialize in blockchain-specific hardware optimizations, offer pre-synced nodes, and provide dedicated support for blockchain infrastructure challenges."
        }
      ]
    },
    {
      id: 'hardware',
      name: 'Hardware',
      icon: <Server className="h-5 w-5" />,
      questions: [
        {
          question: "What are the hardware specifications for Ethereum nodes?",
          answer: "Our standard Ethereum full node configuration includes: 2TB NVMe SSD, 32GB RAM, 4-core processor (minimum). Validator nodes require less storage but benefit from higher reliability components."
        },
        {
          question: "Can I upgrade my node hardware later?",
          answer: "Yes, all our systems are modular and upgradeable. We offer memory, storage, and processor upgrades with expert installation services."
        },
        {
          question: "How long does hardware typically last?",
          answer: "Our enterprise-grade hardware is rated for 5+ years of continuous operation. We provide 3-year warranties with optional extended coverage."
        }
      ]
    },
    {
      id: 'staking',
      name: 'Staking',
      icon: <Wallet className="h-5 w-5" />,
      questions: [
        {
          question: "Do you provide staking setup services?",
          answer: "Yes, we offer complete staking packages including hardware, initial sync, validator key generation, and ongoing monitoring. Our experts can handle the entire setup process for you."
        },
        {
          question: "What's the difference between solo and pooled staking?",
          answer: "Solo staking requires 32 ETH and runs your own validator. Pooled staking allows smaller amounts through services like Lido or RocketPool. We support both approaches with optimized hardware configurations."
        }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      icon: <Shield className="h-5 w-5" />,
      questions: [
        {
          question: "How do you secure the node hardware?",
          answer: "All systems include: Hardware security modules (HSM), BIOS-level protections, encrypted storage, and physical tamper detection. We also offer colocation in Tier-4 data centers."
        },
        {
          question: "What happens if my node goes offline?",
          answer: "Our monitoring systems will alert you immediately. For managed service customers, we automatically initiate failover procedures to minimize downtime and slashing risks."
        }
      ]
    },
    {
      id: 'shipping',
      name: 'Shipping & Support',
      icon: <Truck className="h-5 w-5" />,
      questions: [
        {
          question: "What are your shipping options?",
          answer: "We offer global shipping with DHL Express (3-5 days) or standard freight (7-14 days). All packages include tracking and insurance. Customs support available for international orders."
        },
        {
          question: "What support is included with my purchase?",
          answer: "All hardware comes with 24/7 technical support, 3-year warranty, and optional SLA packages with guaranteed response times for enterprise customers."
        }
      ]
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about our products, services, and blockchain infrastructure solutions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setOpenQuestion(null);
            }}
            className={`flex items-center px-6 py-3 rounded-full border-2 transition-all ${activeCategory === category.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300'}`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto">
        {faqCategories
          .filter(category => category.id === activeCategory)
          .map(category => (
            <div key={category.id} className="space-y-4">
              {category.questions.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                    {openQuestion === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openQuestion === index && (
                    <div className="p-6 pt-0 bg-gray-50">
                      <p className="text-gray-700">{item.answer}</p>
                      {/* Additional content can go here */}
                      {category.id === 'hardware' && index === 0 && (
                        <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-2">Recommended Specifications:</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <strong>Execution Client:</strong> 2TB NVMe SSD, 16GB RAM</li>
                            <li>• <strong>Consensus Client:</strong> 1TB SSD, 8GB RAM</li>
                            <li>• <strong>Validator:</strong> 500GB SSD, 4GB RAM (per validator)</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

        {/* Support CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our blockchain infrastructure experts are available 24/7 to help with any questions about nodes, validators, or custom deployments.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                Contact Support
              </Link>
              <a href='https://discord.com/channels/1359873217300529224/1359873217300529227' className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg transition-colors">
                Join Our Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;