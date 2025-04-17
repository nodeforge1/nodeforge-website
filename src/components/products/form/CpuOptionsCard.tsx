import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Trash2, Plus, Cpu } from "lucide-react";
import { CPUOption } from "../../../context/ProductContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type CpuOptionsCardProps = {
  cpuOptions: CPUOption[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, field: keyof CPUOption, value: string) => void;
};

export function CpuOptionsCard({
  cpuOptions,
  onAddOption,
  onRemoveOption,
  onOptionChange
}: CpuOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-blue-500" />
            CPU Options
          </CardTitle>
          <CardDescription>Configure available processor options</CardDescription>
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
        {cpuOptions.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="grid grid-cols-2 gap-2">
              {/* <Input
                placeholder="Processor Model (e.g., Core i5)"
                value={option.model}
                onChange={(e) => onOptionChange(index, 'model', e.target.value)}
              /> */}
              <Select
                value={option.model}
                onValueChange={(value) => onOptionChange(index, 'model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Processor Model" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Core i3">Core i3</SelectItem>
                  <SelectItem value="Core i5">Core i5</SelectItem>
                  <SelectItem value="Core i7">Core i7</SelectItem>
                  <SelectItem value="Core i9">Core i9</SelectItem>
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
        {cpuOptions.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No processor options added
          </div>
        )}
      </CardContent>
    </Card>
  );
}