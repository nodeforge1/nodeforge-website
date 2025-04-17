import ProductCard from "../components/product/ProductCard";
import Pagination from "../components/product/Pagination";
import { fetcher } from "../services/api";
import { useEffect, useState } from "react";

// Define types for product and response to improve type safety
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  specs: {
    defaultRam: string;
    defaultStorage: string;
    defaultProcessor: string;
  };
};

const PRODUCTS_PER_PAGE = 6;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]); // Added TypeScript type annotation
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Fetch products when the component mounts
  useEffect(() => {
    fetcher("/products")
      .then((res) => {
        if (Array.isArray(res)) {
          setProducts(res);
        } else {
          console.error("Unexpected response format:", res);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);
// console.log(products)
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages based on products length
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  // Get the products to display for the current page
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:py-16" id="products">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
        Choose Your Node Hardware
      </h2>

      {/* Display loading spinner or placeholder when data is loading */}
      {isLoading ? (
        <div className="text-center text-lg">Loading products...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      {/* Render pagination only if there is more than one page */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
