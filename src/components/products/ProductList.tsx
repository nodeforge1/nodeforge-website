
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "./ProductCard";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Package, Plus } from "lucide-react";

export function ProductList() {
  const { products } = useProducts();

if (!Array.isArray(products)) {
  console.error("Expected an array but got:", products);
  return <p>Error: Products data is invalid.</p>;
}


  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] glass-panel rounded-xl p-8">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No products yet</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Get started by creating your first product. You can add details, images, and customization options.
        </p>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
