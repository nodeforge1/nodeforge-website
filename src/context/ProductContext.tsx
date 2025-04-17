import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export type SoftwareOption = {
  name: string;
  price: number;
};

export type CPUOption = {
  model: string;
  price: number;
};

export type RAMOption = {
  size: string;
  price: number;
};

export type StorageOption = {
  type: string;
  price: number;
};

export type Product = {
  _id?: string;
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  specs: {
    software: string;
    defaultSpecs: {
      processor: string;
      ram: string;
      storage: string;
    };
  };
  options: {
    software: SoftwareOption[];
    processor: CPUOption[];
    ram: RAMOption[];
    storage: StorageOption[];
  };
  createdAt?: Date;
  updatedAt?: Date;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const productReducer = (state: Product[], action: any): Product[] => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return action.payload.map((product: any) => ({
        ...product,
        id: product._id || product.id // Ensure we have an id field
      }));
    case 'ADD_PRODUCT':
      return [...state, {
        ...action.payload,
        id: action.payload._id || action.payload.id
      }];
    case 'UPDATE_PRODUCT':
      return state.map((product) =>
        product.id === action.payload.id ? { 
          ...product, 
          ...action.payload.data,
          id: product.id // Preserve the id
        } : product
      );
    case 'DELETE_PRODUCT':
      return state.filter((product) => product.id !== action.payload);
    default:
      return state;
  }
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, dispatch] = useReducer(productReducer, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        if (Array.isArray(response.data)) {
          dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } else {
          console.error("Invalid product data:", response.data);
          toast.error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (product: any) => {
    try {
      console.log(product)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, product);
      dispatch({ type: 'ADD_PRODUCT', payload: response.data });
      toast.success('Product added successfully');
      return response.data;
    } catch (error: any) {
      console.error("Add Product Failed:", error.response?.data || error.message);
      toast.error('Failed to add product');
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, updatedProduct);
      dispatch({ 
        type: 'UPDATE_PRODUCT', 
        payload: { 
          id, 
          data: response.data 
        } 
      });
      toast.success('Product updated successfully');
      return response.data;
    } catch (error: any) {
      console.error("Update Failed:", error.response?.data || error.message);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast.success('Product deleted successfully');
    } catch (error: any) {
      console.error("Delete Failed:", error.response?.data || error.message);
      toast.error('Failed to delete product');
      throw error;
    }
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id || product._id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};