import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CloudinaryUploadWidgetProps {
  uwConfig: any; // Replace 'any' with the appropriate type for uwConfig
  setPublicId: (publicId: string) => void;
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({ uwConfig, setPublicId }) => {
  const [uploadWidget, setUploadWidget] = useState<any>(null); // Replace 'any' with the appropriate type for the widget
  // console.log("object")
  useEffect(() => {
    if (window?.cloudinary) {
      // Initialize the upload widget
      const widget = window.cloudinary.createUploadWidget(uwConfig, (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('Upload successful:', result.info);
          setPublicId(result.info.public_id);
        }
      });
      setUploadWidget(widget);
    }
  }, [uwConfig, setPublicId]);

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("object", uploadWidget)
    
    if (uploadWidget) {
      uploadWidget.open();
    }
  };

  return (
    <button
      id="upload_widget"
      className="border-2 border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center mb-4"
      onClick={handleUploadClick}
      type="button" // Explicitly set the button type to "button"
    >
      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
    </button>
  );
};

export default CloudinaryUploadWidget;