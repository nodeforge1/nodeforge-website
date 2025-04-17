import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

interface CloudnaryProps {
    cldImg: string,
    format: string,
    quality: string,
    width: number,
    height: number
}

const Cloudnary = ({cldImg, format="auto", quality="auto", width=500, height=500}: CloudnaryProps) => {
  const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDNARY_NAME } });
  
  // Use this sample image or upload your own via the Media Explorer
  const img = cld
        .image(cldImg)
        .format(format) // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality(quality)
        .resize(auto().gravity(autoGravity()).width(width).height(height)); // Transform the image: auto-crop to square aspect_ratio

  return (<AdvancedImage cldImg={img}/>);
};

export default Cloudnary