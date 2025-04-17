import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'crypto' | 'bank_transfer';

export type OrderProduct = {
  productId: string;
  name: string;
  quantity: number;
  basePrice: number;
  configuration: {
    ram?: {
      size: string;
      price: number;
    };
    processor?: {
      model: string;
      price: number;
    };
    storage?: {
      type: string;
      price: number;
    };
  };
};

export type OrderItem = {
  _id: string;
  orderID: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingInfo: {
    sameAsShipping: boolean;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  products: OrderProduct[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type OrdersResponse = {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  orders: OrderItem[];
};

type OrderContextType = {
  orders: OrderItem[];
  addOrder: (order: Omit<OrderItem, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<OrderItem>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => OrderItem | undefined;
  fetchOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<OrdersResponse>(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (order: Omit<OrderItem, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
    try {
      const response = await axios.post<{ order: OrderItem }>(
        `${import.meta.env.VITE_API_URL}/orders`,
        order
      );
      setOrders((prevOrders) => [...prevOrders, response.data.order]);
      toast.success('Order added successfully');
    } catch (error) {
      toast.error('Failed to add order');
      console.error('Error adding order:', error);
    }
  };

  const updateOrder = async (id: string, updates: Partial<OrderItem>) => {
    try {
      const response = await axios.put<{ order: OrderItem }>(
        `${import.meta.env.VITE_API_URL}/orders/${id}`,
        updates
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === id ? response.data.order : order))
      );
      toast.success('Order updated successfully');
    } catch (error) {
      toast.error('Failed to update order');
      console.error('Error updating order:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await axios.put<{ order: OrderItem }>(
        `${import.meta.env.VITE_API_URL}/orders/${id}/status`,
        { orderStatus: status }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === id ? response.data.order : order))
      );
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    }
  };

  const getOrder = (id: string) => {
    return orders.find((order) => order._id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        getOrder,
        fetchOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};