import { Cloudinary } from "@cloudinary/url-gen/index";
// import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { X } from "lucide-react";
// import { toast } from "sonner";
// import { useState } from "react";
import { AdvancedImage, placeholder, responsive } from "@cloudinary/react";
import CloudinaryUploadWidget from "../../cloudnary/CloudinaryUploadWidget";


type ImageUploaderProps = {
  // image: string;
  onImageChange: (image: string) => void;
  publicId: string; 
  setPublicId: (publicId: string) => void;
};

// Configuration
const cloudName = import.meta.env.VITE_CLOUDNARY_NAME;
const uploadPreset = 'NodeHub';

export function ImageUploader({ onImageChange, publicId, setPublicId }: ImageUploaderProps) {

  // Cloudinary configuration
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  // Upload Widget Configuration
  const uwConfig = {
    cloudName,
    uploadPreset,
    // Uncomment and modify as needed:
    // cropping: true,
    // showAdvancedOptions: true,
    // sources: ['local', 'url'],
    // multiple: false,
    // folder: 'user_images',
    // tags: ['users', 'profile'],
    // context: { alt: 'user_uploaded' },
    // clientAllowedFormats: ['images'],
    // maxImageFileSize: 2000000,
    // maxImageWidth: 2000,
    // theme: 'purple',
  };

  // const handleImageUpload = () => {
  //   const widget = window.cloudinary.createUploadWidget(uwConfig, (error:any, result:any) => {
  //     if (!error && result && result.event === "success") {
  //       const imageUrl = result.info.secure_url;
  //       onImageChange(imageUrl);
  //       toast.success("Image uploaded successfully!");
  //     } else {
  //       toast.error("Image upload failed. Please try again.");
  //     }
  //   });
  //   widget.open();
  // };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Image</CardTitle>
        <CardDescription>Upload a product image</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {publicId ? (
          <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-md">
            {/* <img
              src={image}
              alt="Product preview"
              className="w-full h-full object-cover"
            /> */}
            <AdvancedImage
              style={{ maxWidth: '100%' }}
              cldImg={cld.image(publicId)}
              plugins={[responsive(), placeholder()]}
            />
            <button
              type="button"
              onClick={() => onImageChange("")}
              className="absolute top-2 right-2 bg-white/90 p-1 rounded-full hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          
            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
        )}
        {/* <Button
          type="button"
          onClick={handleImageUpload}
          variant="outline"
          className="w-full"
        >
          Upload Image
        </Button> */}
      </CardContent>
    </Card>
  );
}
