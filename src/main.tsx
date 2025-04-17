import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from "./components/ui/sonner";

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const queryClient = new QueryClient();
createRoot(rootElement).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <OrderProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
    <App />
            </TooltipProvider>
          </OrderProvider>
        </ProductProvider>
      </QueryClientProvider>
  </StrictMode>
);