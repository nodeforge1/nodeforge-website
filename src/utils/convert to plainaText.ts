import { CartItem } from "../types";

  
export  function retrieveSystemInfoAsText(items: CartItem[]): string {
    let result = "";
  
    items.forEach((item) => {
      const { name, config, quantity, specs } = item;
      // console.log(name, config, items);
      const { processor, ram, storage } = config;
  
      // Use specs if available, otherwise fallback to config
      const finalProcessor = specs?.processor || processor || "Unknown";
      const finalRam = specs?.ram || ram || "Unknown";
      const finalStorage = specs?.storage || storage || "Unknown";
      const finalQuantity = quantity || 1; // Default to 1 if quantity is undefined
  
      // Append the details to the result string
      result += `Name: ${name}\n`;
      result += `Processor: ${finalProcessor}\n`;
      result += `RAM: ${finalRam}\n`;
      result += `Storage: ${finalStorage}\n`;
      result += `Quantity: ${finalQuantity}\n`;
      result += `Price: ${item.totalPrice}\n`;
      result += "-------------------------\n"; // Separator between items
    });
  
    return result;
  }