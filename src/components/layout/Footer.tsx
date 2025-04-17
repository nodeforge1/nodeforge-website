import { Link } from 'react-router-dom';
import { 
  Server, 
  MessageSquare,
  Mail,
  ArrowRight,
  Shield,
  Cpu,
  HardDrive,
  X,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">NODEFORGE</span>
            </div>
            <p className="text-gray-400">
              Empowering the Ethereum ecosystem with sustainable and reliable node infrastructure.
            </p>
            <div className="flex space-x-4">
              <a href="https://chat.whatsapp.com/IHlA8ZPoAXg7H7FvRYDK0W" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-green-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="https://x.com/nodeforge1" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-green-400 transition-colors">
                <X className="h-5 w-5" />
              </a>
              {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors">
                <Github className="h-5 w-5" />
              </a> */}
              <a href="https://discord.com/channels/1359873217300529224/1359873217300529227" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Products</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Node Hardware
                </Link>
              </li>
              <li>
                <Link to="/products#validators" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Validator Solutions
                </Link>
              </li>
              <li>
                <Link to="/products#layer2" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  L2 Node Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://nodebridge-africa.gitbook.io/nodebridge-africa" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Documentation
                </a>
              </li>
              <li>
                <Link to="/FAQPage" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400 flex-1"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-800">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-green-400" />
            <div>
              <h4 className="font-semibold">Secure Setup</h4>
              <p className="text-gray-400 text-sm">Enhanced security measures</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Cpu className="h-8 w-8 text-green-400" />
            <div>
              <h4 className="font-semibold">Optimized Performance</h4>
              <p className="text-gray-400 text-sm">High-performance hardware</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <HardDrive className="h-8 w-8 text-green-400" />
            <div>
              <h4 className="font-semibold">Reliable Storage</h4>
              <p className="text-gray-400 text-sm">Enterprise-grade SSDs</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} NODEFORGE. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/shipping" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}