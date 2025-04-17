import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type ProductInfoCardProps = {
  name: string;
  description: string;
  basePrice: number;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  defaultProcessor: string;
  defaultRam: string;
  defaultStorage: string;
  onDefaultProcessorChange: (value: string) => void;
  onDefaultRamChange: (value: string) => void;
  onDefaultStorageChange: (value: string) => void;
  processorOptions: string[];
  ramOptions: string[];
  storageOptions: string[];
};

export function ProductInfoCard({
  name,
  description,
  basePrice,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  defaultProcessor,
  defaultRam,
  defaultStorage,
  onDefaultProcessorChange,
  onDefaultRamChange,
  onDefaultStorageChange,
  processorOptions,
  ramOptions,
  storageOptions,
}: ProductInfoCardProps) {
  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Basic details and default specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter product description"
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price ($)</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            min="0"
            value={basePrice}
            onChange={(e) => onPriceChange(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Default Processor Selection */}
          <div className="space-y-2">
            <Label htmlFor="defaultProcessor">Default Processor</Label>
            <Select 
              value={defaultProcessor} 
              onValueChange={onDefaultProcessorChange}
            >
              <SelectTrigger id="defaultProcessor">
                <SelectValue placeholder="Select processor" />
              </SelectTrigger>
              <SelectContent>
                {processorOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Default RAM Selection */}
          <div className="space-y-2">
            <Label htmlFor="defaultRam">Default RAM</Label>
            <Select 
              value={defaultRam} 
              onValueChange={onDefaultRamChange}
            >
              <SelectTrigger id="defaultRam">
                <SelectValue placeholder="Select RAM" />
              </SelectTrigger>
              <SelectContent>
                {ramOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Default Storage Selection */}
          <div className="space-y-2">
            <Label htmlFor="defaultStorage">Default Storage</Label>
            <Select 
              value={defaultStorage} 
              onValueChange={onDefaultStorageChange}
            >
              <SelectTrigger id="defaultStorage">
                <SelectValue placeholder="Select storage" />
              </SelectTrigger>
              <SelectContent>
                {storageOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}