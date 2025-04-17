import { Mail, Phone, MapPin } from 'lucide-react';
import { useState, ChangeEvent, useEffect } from 'react';
import { useForm } from '@formspree/react';
import { toast, Toaster } from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [state, handleSubmit] = useForm("xnnplkyz");

  // Clear form on successful submission
  useEffect(() => {
    if (state.succeeded) {
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      toast.success('Message sent successfully! We will get back to you soon.', {
        duration: 5000,
      });
    }
  }, [state.succeeded]);

  // Show error toast if submission fails
  useEffect(() => {
    if (state.errors && state.errors ) {
      toast.error('Failed to send message. Please try again.', {
        duration: 5000,
      });
    }
  }, [state.errors]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16" id="contact">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#4BB543',
            color: '#fff',
          },
          error: {
            style: {
              background: '#FF3333',
            },
          },
        }}
      />
      
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Contact Us</h2>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-500 flex-shrink-0" />
                <a href="mailto:nodeforge1@gmail.com" className="text-sm sm:text-base hover:text-green-600 transition-colors">
                  nodeforge1@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                <a href="tel:+2347045689794" className="text-sm sm:text-base hover:text-green-600 transition-colors">
                  +2347045689794
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  12 Alhaji Abdulazeez Crescent, Oreyo, Ikorodu 104102, Lagos
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message*
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {state.submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}