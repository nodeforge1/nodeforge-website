
import { DashboardLayout } from "../../components/layout/Dashboard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ProductForm } from "../../components/products/ProductForm";

const NewProduct = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Add New Product"
          description="Create a new computer product with customizable options"
        />
        
        <ProductForm />
      </div>
    </DashboardLayout>
  );
};

export default NewProduct;
