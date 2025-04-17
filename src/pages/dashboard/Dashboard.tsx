import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { DashboardLayout } from "../../components/layout/Dashboard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ProductCard } from "../../components/products/ProductCard";
import { Cpu, Gift, Package, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { products } = useProducts() || { products: [] };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  const latestProducts = products?.slice(0, 3) || [];
  const totalProducts = products?.length || 0;
  const averagePrice = totalProducts
    ? products.reduce((sum, product:any) => sum + (product.price || 0), 0) / totalProducts
    : 0;
  const totalOptions = products?.reduce(
    (sum, product:any) =>
      sum +
      (product.specs?.processor?.length || 0) +
      (product.specs?.ram?.length || 0) +
      (product.specs?.storage?.length || 0),
    0
  );



  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 px-4 sm:px-6">
        <SectionHeader
          title="Dashboard"
          description="Welcome to your product management dashboard"
          action={
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link to="/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          }
        />
        
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <ShoppingBag className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customization Options</CardTitle>
              <Gift className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOptions}</div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Components</CardTitle>
              <Cpu className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((sum, p:any) => sum + (p.specs?.processor?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Products Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h3 className="text-lg font-medium">Latest Products</h3>
            <Button variant="outline" asChild size="sm" className="w-full sm:w-auto">
              <Link to="/dashboard-home">View all</Link>
            </Button>
          </div>

          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {latestProducts.map((product: any) => (
                <ProductCard key={product?._id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Package className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button asChild size="sm" className="w-full sm:w-auto">
                  <Link to="/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;