import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Trash2, Plus, MemoryStick } from "lucide-react";
import { RAMOption } from "../../../context/ProductContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type RamOptionsCardProps = {
  ramOptions: RAMOption[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, field: keyof RAMOption, value: string) => void;
};

export function RamOptionsCard({
  ramOptions,
  onAddOption,
  onRemoveOption,
  onOptionChange
}: RamOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg flex items-center">
            <MemoryStick className="h-5 w-5 mr-2 text-green-500" />
            RAM Options
          </CardTitle>
          <CardDescription>Configure available RAM options and pricing</CardDescription>
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
      <CardContent className="space-y-4 pt-3 bg-white">
        {ramOptions.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="grid grid-cols-2 gap-2">
              {/* <Input
                placeholder="Size (e.g., 16GB)"
                value={option.size}
                onChange={(e) => onOptionChange(index, 'size', e.target.value)}
              /> */}
              <Select
                value={option.size}
                onValueChange={(value) => onOptionChange(index, 'size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Processor Model" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="16GB">16GB</SelectItem>
                  <SelectItem value="32GB">32GB</SelectItem>
                  <SelectItem value="64GB">64GB</SelectItem>
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveOption(index)}
              className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {ramOptions.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No RAM options configured yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}