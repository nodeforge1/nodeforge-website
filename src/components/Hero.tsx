import { Server, Shield, Recycle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full opacity-20"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
              Run Your Ethereum Node
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent block mt-2">
                with Confidence
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 animate-fade-in-delay px-4">
              Sustainable, reliable, and customizable refurbished hardware for your Ethereum node
            </p>
            
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg 
                       hover:bg-green-600 transition-all transform hover:scale-105 animate-fade-in-delay-2"
            >
              Explore Products
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
              <div className="group p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Server className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Custom Built</h3>
                <p className="text-gray-400">Tailored to your specific node requirements</p>
              </div>
              
              <div className="group p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reliable</h3>
                <p className="text-gray-400">Thoroughly tested and guaranteed performance</p>
              </div>
              
              <div className="group p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Recycle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
                <p className="text-gray-400">Eco-friendly refurbished hardware</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}