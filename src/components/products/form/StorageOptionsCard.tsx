import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Trash2, Plus, HardDrive } from "lucide-react";
import { StorageOption } from "../../../context/ProductContext";

type StorageOptionsCardProps = {
  storageOptions: StorageOption[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, field: keyof StorageOption, value: string) => void;
};

export function StorageOptionsCard({ 
  storageOptions, 
  onAddOption, 
  onRemoveOption, 
  onOptionChange 
}: StorageOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-purple-500" />
            Storage Options
          </CardTitle>
          <CardDescription>Configure available storage options</CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={onAddOption} 
          size="sm" 
          variant="outline"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        {storageOptions.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={option.type} 
                onValueChange={(value) => onOptionChange(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="2TB SSD">2TB SSD</SelectItem>
                  <SelectItem value="4TB SSD">4TB SSD</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Price ($)"
                value={option.price}
                min="0"
                step="10"
                onChange={(e) => onOptionChange(index, 'price', e.target.value)}
              />
            </div>
            {storageOptions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveOption(index)}
                className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {storageOptions.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No storage options added
          </div>
        )}
      </CardContent>
    </Card>
  );
}