import { RAM_OPTIONS, STORAGE_OPTIONS, PROCESSOR_OPTIONS } from '../config/constants';
import { PROCESSOROptionKey, RAMOptionKey, STORAGEOptionKey } from '../types';

export function calculatePrice(price: number, config: { software?: string; ram?: any; storage?: string; processor?: string }) {
  const { 
     // Ensure a default is set
    ram = "16GB", 
    storage = "2TB SSD", 
    processor = "Core i3" 
  } = config;


  const ramPrice = RAM_OPTIONS[ram as RAMOptionKey]?.price || 0;
  const storagePrice = STORAGE_OPTIONS[storage as STORAGEOptionKey]?.price || 0;
  const processorPrice = PROCESSOR_OPTIONS[processor as PROCESSOROptionKey]?.price || 0;

  const totalPrice = price + ramPrice + storagePrice + processorPrice;

  return totalPrice;
}
