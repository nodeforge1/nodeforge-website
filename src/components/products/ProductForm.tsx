import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { ProductInfoCard } from "./form/ProductInfoCard";
import { ImageUploader } from "./form/ImageUploader";
import { CpuOptionsCard } from "./form/CpuOptionsCard";
import { RamOptionsCard } from "./form/RamOptionsCard";
import { StorageOptionsCard } from "./form/StorageOptionsCard";
import { SoftwareOptionsCard } from "./form/SoftwareOptionsCard";
import { validateProductForm, ProductFormData } from "./form/FormValidator";
import { Button } from "../ui/button";
import { toast } from "sonner";

type ProductFormProps = {
  editMode?: boolean;
  productId?: string;
};

export function ProductForm({ editMode = false, productId }: ProductFormProps) {
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProduct } = useProducts();
  const [publicId, setPublicId] = useState('');

  const existingProduct = productId ? getProduct(productId) : undefined;

  const [formState, setFormState] = useState({
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    basePrice: existingProduct?.basePrice || 0,
    image: existingProduct?.image || "j",
    specs: {
      software: existingProduct?.specs?.software || "Coincashew",
      defaultSpecs: {
        processor: existingProduct?.specs?.defaultSpecs?.processor || "Core i3",
        ram: existingProduct?.specs?.defaultSpecs?.ram || "16GB",
        storage: existingProduct?.specs?.defaultSpecs?.storage || "2TB SSD"
      }
    },
    options: {
      software: existingProduct?.options?.software.map((option: any) => ({ name: option.name, price: option.price })) || [
        { name: "Coincashew", price: 0 }
      ],
      processor: existingProduct?.options?.processor.map((option: any) => ({ model: option.model, price: option.price })) || [
        { model: "Core i3", price: 0 },
      ],
      ram: existingProduct?.options?.ram.map((option: any) => ({ size: option.size, price: option.price })) || [
        { size: "16GB", price: 0 },
      ],
      storage: existingProduct?.options?.storage.map((option: any) => ({ type: option.type, price: option.price })) || [
        { type: "2TB SSD", price: 0 },
      ]
    }
  });
  console.log(existingProduct?.options)

  // Field change handlers
  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: field === "basePrice" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Default specs handlers
  const handleDefaultSpecChange = (field: keyof typeof formState.specs.defaultSpecs, value: string) => {
    setFormState(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        defaultSpecs: {
          ...prev.specs.defaultSpecs,
          [field]: value
        }
      }
    }));
  };


  // Software handlers
  const handleAddSoftwareOption = () => {
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        software: [
          ...prev.options.software,
          { name: "", price: 0 }
        ]
      }
    }));
  };

  const handleRemoveSoftwareOption = (index: number) => {
    const updatedOptions = [...formState.options.software];
    updatedOptions.splice(index, 1);
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        software: updatedOptions
      }
    }));
  };

  const handleSoftwareOptionChange = (index: number, field: keyof typeof formState.options.software[0], value: string) => {
    const updatedOptions = [...formState.options.software];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === "price" ? Number(value) : value
    };
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        software: updatedOptions
      }
    }));
  };

  // CPU handlers
  // console.log(formState)
  const handleAddCpuOption = () => {
    setFormState(prev => {
      // Validate existing options first

      const hasEmptyOption = prev.options.processor.some(
        opt => !opt.model.trim() || isNaN(opt.price)
      );
      
      if (hasEmptyOption) {
        toast.error("Please fill out all existing CPU options before adding new ones");
        return prev;
      }
  
      // Add new option with unique temporary ID
      // return prev
      return {
        ...prev,
        options: {
          ...prev.options,
          processor: [
            ...prev.options.processor,
            { 
              model: "Core i3", 
              price: 0,
            }
          ]
        }
      };
    });
  };

  const handleRemoveCpuOption = (index: number) => {
    const updatedOptions = [...formState.options.processor];
    updatedOptions.splice(index, 1);
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        processor: updatedOptions
      }
    }));
  };

  const handleCpuOptionChange = (index: number, field: keyof typeof formState.options.processor[0], value: string) => {
    const updatedOptions = [...formState.options.processor];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === "price" ? Number(value) : value
    };
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        processor: updatedOptions
      }
    }));
  };

  // RAM handlers
  const handleAddRamOption = () => {
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        ram: [
          ...prev.options.ram,
          { size: "16GB", price: 0 }
        ]
      }
    }));
  };

  const handleRemoveRamOption = (index: number) => {
    const updatedOptions = [...formState.options.ram];
    updatedOptions.splice(index, 1);
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        ram: updatedOptions
      }
    }));
  };

  const handleRamOptionChange = (index: number, field: keyof typeof formState.options.ram[0], value: string) => {
    const updatedOptions = [...formState.options.ram];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === "price" ? Number(value) : value
    };
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        ram: updatedOptions
      }
    }));
  };

  // Storage handlers
  const handleAddStorageOption = () => {
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        storage: [
          ...prev.options.storage,
          { type: "2TB SSD", price: 0 }
        ]
      }
    }));
  };

  const handleRemoveStorageOption = (index: number) => {
    const updatedOptions = [...formState.options.storage];
    updatedOptions.splice(index, 1);
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        storage: updatedOptions
      }
    }));
  };

  const handleStorageOptionChange = (index: number, field: keyof typeof formState.options.storage[0], value: string) => {
    const updatedOptions = [...formState.options.storage];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === "price" ? Number(value) : value
    };
    setFormState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        storage: updatedOptions
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProductForm(formState)) {
      return;
    }

    const productData = {
      name: formState.name,
      description: formState.description,
      basePrice: formState.basePrice,
      image: publicId || formState.image,
      specs: {
        software: formState.specs.software,
        defaultSpecs: {
          processor: formState.specs.defaultSpecs.processor,
          ram: formState.specs.defaultSpecs.ram,
          storage: formState.specs.defaultSpecs.storage
        }
      },
      options: {
        software: formState.options.software,
        processor: formState.options.processor,
        ram: formState.options.ram,
        storage: formState.options.storage
      }
    };

    if (editMode && productId) {
      updateProduct(productId, productData);
    } else {
      addProduct(productData);
    }

    navigate("/dashboard-home");
  };

  useEffect(() => {
    setPublicId(existingProduct?.image || "");
  }, [existingProduct]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductInfoCard
          name={formState.name}
          description={formState.description}
          basePrice={formState.basePrice}
          onNameChange={(value) => handleFieldChange("name", value)}
          onDescriptionChange={(value) => handleFieldChange("description", value)}
          onPriceChange={(value) => handleFieldChange("basePrice", value)}
          defaultProcessor={formState.specs.defaultSpecs.processor}
          defaultRam={formState.specs.defaultSpecs.ram}
          defaultStorage={formState.specs.defaultSpecs.storage}
          onDefaultProcessorChange={(value: string) => handleDefaultSpecChange("processor", value)}
          onDefaultRamChange={(value: string) => handleDefaultSpecChange("ram", value)}
          onDefaultStorageChange={(value: string) => handleDefaultSpecChange("storage", value)}
          processorOptions={formState.options.processor.map(p => p.model)}
          ramOptions={formState.options.ram.map(r => r.size)}
          storageOptions={formState.options.storage.map(s => s.type)}
        />
        <ImageUploader
          publicId={publicId}
          setPublicId={setPublicId}
          onImageChange={() => setPublicId("")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoftwareOptionsCard
          softwareOptions={formState.options.software}
          onAddOption={handleAddSoftwareOption}
          onRemoveOption={handleRemoveSoftwareOption}
          onOptionChange={handleSoftwareOptionChange}
        />

        <CpuOptionsCard
          cpuOptions={formState.options.processor}
          onAddOption={handleAddCpuOption}
          onRemoveOption={handleRemoveCpuOption}
          onOptionChange={handleCpuOptionChange}
        />

        <RamOptionsCard
          ramOptions={formState.options.ram}
          onAddOption={handleAddRamOption}
          onRemoveOption={handleRemoveRamOption}
          onOptionChange={handleRamOptionChange}
        />

        <StorageOptionsCard
          storageOptions={formState.options.storage}
          onAddOption={handleAddStorageOption}
          onRemoveOption={handleRemoveStorageOption}
          onOptionChange={handleStorageOptionChange}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/products")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editMode ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}