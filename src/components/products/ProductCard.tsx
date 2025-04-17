
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useProducts } from "../../context/ProductContext";
import { cn } from "../../utils/utils";
// import { AdvancedImage, placeholder, responsive } from "@cloudinary/react";
import Cloudnary from "../cloudnary/Cloudnary";

type ProductCardProps = {
  product: any;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteProduct } = useProducts();

  const handleDelete = () => {
    deleteProduct(product._id);
    setShowDeleteDialog(false);
  };
  // console.log(product?._id)
  return (
    <>
      <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md group", className)}>
        <div className="aspect-[16/9] overflow-hidden bg-secondary/20">
                    

          <Cloudnary cldImg={product.image} format="auto" quality="auto" width={500} height={500} />
          {/* <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          /> */}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>
            <div className="bg-primary px-2 py-1 rounded-full text-xs font-medium">
              ${product.basePrice}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">CPU Options</span>
              <span className="font-medium">{(product?.options?.processor.length || 3)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">RAM Options</span>
              <span className="font-medium">{product?.options?.ram.length || 3}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Storage</span>
              <span className="font-medium">{product?.options?.storage.length || 3}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/products/edit/${product._id}`}>
            
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass-panel bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{product.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
