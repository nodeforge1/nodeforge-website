interface ProductOption {
    name?: string;
    size?: string;
    type?: string;
    model?: string;
    price: number;
  }
  
  interface ProductOptions {
    software?: ProductOption[];
    ram?: ProductOption[];
    storage?: ProductOption[];
    processor?: ProductOption[];
  }
  
  interface Product {
    basePrice: number;
    options: ProductOptions;
  }
  
  interface SelectedOptions {
    software?: string;
    ram?: string;
    storage?: string;
    processor?: string;
    quantity?: number;
  }
  
  /**
   * Calculates the total price of a product with selected options
   * @param product - The product with base price and configuration options
   * @param selectedOptions - User-selected options
   * @returns Total calculated price
   * @throws Error if invalid options are provided
   */
  export function calculateTotalPrice(
    product: Product,
    selectedOptions: SelectedOptions
  ): number {
    // Validate product structure
    if (typeof product?.basePrice !== 'number') {
      throw new Error('Invalid product: basePrice must be a number');
    }
  
    let total = product.basePrice;
    console.log(product)
    console.log(selectedOptions)
    // Helper function to find and validate options
    const addOptionPrice = (
      optionType: keyof ProductOptions,
      selectedValue: string | undefined,
      optionField: 'name' | 'size' | 'type' | 'model'
    ) => {
      if (!selectedValue || !product.options[optionType]) return;
  
      const option = product.options[optionType]?.find(
        (opt) => opt[optionField] === selectedValue
      );
  
      if (!option) {
        throw new Error(
          `Invalid ${optionType} option: ${selectedValue} not found`
        );
      }
  
      if (typeof option.price !== 'number') {
        throw new Error(
          `Invalid ${optionType} price: must be a number for ${selectedValue}`
        );
      }
  
      total += option.price;
    };
  
    // Calculate additional costs
    try {
      addOptionPrice('software', selectedOptions.software, 'name');
      addOptionPrice('ram', selectedOptions.ram, 'size');
      addOptionPrice('storage', selectedOptions.storage, 'type');
      addOptionPrice('processor', selectedOptions.processor, 'model');
  
      // Apply quantity
      const quantity = selectedOptions.quantity || 1;
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }
  
      return total * quantity;
    } catch (error) {
      console.error('Price calculation failed:', error);
      throw error; // Re-throw for handling in the calling function
    }
  }