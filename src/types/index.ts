import { PROCESSOR_OPTIONS, RAM_OPTIONS, STORAGE_OPTIONS } from "../config/constants";

export interface NodeConfig {
  software: string;
  ram: string;
  storage: string;
  processor: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  price?: number;
  image: string;
  specs: {
    software: string;
    ram: string;
    storage: string;
    processor: string;
  };

}

export interface CartItem extends Product {
  quantity: number;
  config: NodeConfig;
  totalPrice: number;
}

export interface PaymentConfig {
  currency: string;
  amount: number;
  receiver: string;
}

declare global {
  interface Window {
    cloudinary: any; // or the actual type of the cloudinary object
  }
}

export type RAMOptionKey = keyof typeof RAM_OPTIONS;
export type STORAGEOptionKey = keyof typeof STORAGE_OPTIONS;
export type PROCESSOROptionKey = keyof typeof PROCESSOR_OPTIONS;

