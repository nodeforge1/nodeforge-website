
import { DashboardLayout } from "../../components/layout/Dashboard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductList } from "../../components/products/ProductList";

const Products = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Products"
          description="Manage your computer products and their customization options"
          action={
            <Button asChild>
              <Link to="/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          }
        />
        
        <ProductList />
      </div>
    </DashboardLayout>
  );
};

export default Products;
