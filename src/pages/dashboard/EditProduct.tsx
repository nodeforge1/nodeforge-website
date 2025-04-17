import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useEffect } from "react";
import { DashboardLayout } from "../../components/layout/Dashboard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ProductForm } from "../../components/products/ProductForm";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>(); // id is always a string from useParams
  const navigate = useNavigate();
  const { getProduct } = useProducts();

  const productId = id ? id : undefined; // Convert id to number
  const product = productId ? getProduct(productId as any) : undefined;

  useEffect(() => {
    if (!product) {
      toast.error("Product not found");
      // navigate("/dashboard/products"); // Redirect to products list if not found
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeader
          title={`Edit ${product.name}`}
          description="Update your product details and customization options"
        />

        <ProductForm editMode productId={productId} />
      </div>
    </DashboardLayout>
  );
};

export default EditProduct;
