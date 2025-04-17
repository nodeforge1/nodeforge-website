import { toast } from "sonner";
import { CPUOption, RAMOption, StorageOption, SoftwareOption } from "../../../context/ProductContext";

export type ProductFormData = {
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
};

export function validateProductForm(formData: ProductFormData): boolean {
  // Validate basic product info
  if (!formData.name.trim()) {
    toast.error("Product name is required");
    return false;
  }

  if (!formData.description.trim()) {
    toast.error("Product description is required");
    return false;
  }

  if (formData.basePrice < 0) {
    toast.error("Base price cannot be negative");
    return false;
  }

  // Validate default specs
  if (!formData.specs.software.trim()) {
    toast.error("Default software must be selected");
    return false;
  }

  if (!formData.specs.defaultSpecs.processor.trim()) {
    toast.error("Default processor must be selected");
    return false;
  }

  if (!formData.specs.defaultSpecs.ram.trim()) {
    toast.error("Default RAM must be selected");
    return false;
  }

  if (!formData.specs.defaultSpecs.storage.trim()) {
    toast.error("Default storage must be selected");
    return false;
  }

  // Validate software options
  for (const [index, option] of formData.options.software.entries()) {
    if (!option.name.trim()) {
      toast.error(`Software option ${index + 1} must have a name`);
      return false;
    }
    if (option.price < 0) {
      toast.error(`Price for ${option.name} cannot be negative`);
      return false;
    }
  }

  // Validate CPU options
  for (const [index, option] of formData.options.processor.entries()) {
    if (!option.model.trim()) {
      toast.error(`CPU option ${index + 1} must have a model`);
      return false;
    }
    if (option.price < 0) {
      toast.error(`Price for ${option.model} cannot be negative`);
      return false;
    }
  }

  // Validate RAM options
  for (const [index, option] of formData.options.ram.entries()) {
    if (!option.size.trim()) {
      toast.error(`RAM option ${index + 1} must have a size`);
      return false;
    }
    if (option.price < 0) {
      toast.error(`Price for ${option.size} cannot be negative`);
      return false;
    }
  }

  // Validate Storage options
  for (const [index, option] of formData.options.storage.entries()) {
    if (!option.type.trim()) {
      toast.error(`Storage option ${index + 1} must have a type`);
      return false;
    }
    if (option.price < 0) {
      toast.error(`Price for ${option.type} cannot be negative`);
      return false;
    }
  }

  // Ensure at least one option exists for each category
  if (formData.options.software.length === 0) {
    toast.error("At least one software option is required");
    return false;
  }

  if (formData.options.processor.length === 0) {
    toast.error("At least one processor option is required");
    return false;
  }

  if (formData.options.ram.length === 0) {
    toast.error("At least one RAM option is required");
    return false;
  }

  if (formData.options.storage.length === 0) {
    toast.error("At least one storage option is required");
    return false;
  }

  // Validate default selections exist in options
  if (!formData.options.processor.some(p => p.model === formData.specs.defaultSpecs.processor)) {
    toast.error("Default processor must be one of the available options");
    return false;
  }

  if (!formData.options.ram.some(r => r.size === formData.specs.defaultSpecs.ram)) {
    toast.error("Default RAM must be one of the available options");
    return false;
  }

  if (!formData.options.storage.some(s => s.type === formData.specs.defaultSpecs.storage)) {
    toast.error("Default storage must be one of the available options");
    return false;
  }

  return true;
}