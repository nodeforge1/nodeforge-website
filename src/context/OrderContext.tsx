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
  loading: boolean;
  error: string | null;
  setPageSize: (size: number) => void;
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  addOrder: (order: Omit<OrderItem, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<OrderItem>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => OrderItem | undefined;
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  setPage: (page: number) => void;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20, // Default page size
  });

  // const fetchOrders = async () => {
  //   try {
  //     const response = await axios.get<OrdersResponse>(`${import.meta.env.VITE_API_URL}/orders`);
  //     setOrders(response.data.orders);
  //   } catch (error) {
  //     toast.error('Failed to fetch orders');
  //     console.error('Error fetching orders:', error);
  //   }
  // };
  const fetchOrders = async (page = pagination.page, limit = pagination.limit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<OrdersResponse>(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          params: {
            page,
            limit,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch orders');
      }

      setOrders(response.data.orders);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
        limit,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchOrders(page);
    }
  };

  const setPageSize = (size: number) => {
    if (size > 0) {
      fetchOrders(1, size);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (order: Omit<OrderItem, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
    setLoading(true);
    try {
      const response = await axios.post<{ success: boolean; order: OrderItem }>(
        `${import.meta.env.VITE_API_URL}/orders`,
        order
      );

      if (!response.data.success) {
        throw new Error('Failed to add order');
      }

      setOrders((prev) => [response.data.order, ...prev]);
      toast.success('Order added successfully');
      // Refresh pagination data
      await fetchOrders(pagination.page, pagination.limit);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add order');
      toast.error('Failed to add order');
      console.error('Error adding order:', error);
    } finally {
      setLoading(false);
    }
  };


  const updateOrder = async (id: string, updates: Partial<OrderItem>) => {
    setLoading(true);
    try {
      const response = await axios.put<{ success: boolean; order: OrderItem }>(
        `${import.meta.env.VITE_API_URL}/orders/${id}`,
        updates
      );

      if (!response.data.success) {
        throw new Error('Failed to update order');
      }

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? response.data.order : order))
      );
      toast.success('Order updated successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update order');
      toast.error('Failed to update order');
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setLoading(true);
    try {
      const response = await axios.put<{ success: boolean; order: OrderItem }>(
        `${import.meta.env.VITE_API_URL}/orders/${id}/status`,
        { orderStatus: status }
      );

      if (!response.data.success) {
        throw new Error('Failed to update order status');
      }

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? response.data.order : order))
      );
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update order status');
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.delete<{ success: boolean }>(
        `${import.meta.env.VITE_API_URL}/orders/${id}`
      );

      if (!response.data.success) {
        throw new Error('Failed to delete order');
      }

      setOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success('Order deleted successfully');
      // Refresh pagination data
      await fetchOrders(pagination.page, pagination.limit);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete order');
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    } finally {
      setLoading(false);
    }
  };


  const getOrder = (id: string) => {
    return orders.find((order) => order._id === id);
  };

  return (
    <OrderContext.Provider
    value={{
      orders,
      loading,
      error,
      pagination,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deleteOrder,
      getOrder,
      fetchOrders,
      setPage,
      setPageSize,
    }}
  >
    {children}
  </OrderContext.Provider>
  );
};