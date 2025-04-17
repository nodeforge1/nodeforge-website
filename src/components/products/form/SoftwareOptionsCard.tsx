// SoftwareOptionsCard.tsx

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";


type SoftwareOption = {
  name: string;
  price: number;
};

type SoftwareOptionsCardProps = {
  softwareOptions: SoftwareOption[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, field: keyof SoftwareOption, value: string) => void;
};

export function SoftwareOptionsCard({
  softwareOptions,
  onAddOption,
  onRemoveOption,
  onOptionChange,
}: SoftwareOptionsCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Software Options</h3>
        <Button type="button" size="sm" onClick={onAddOption}>
          Add Option
        </Button>
      </div>
      
      <div className="space-y-4">
        {softwareOptions.map((option, index) => (
          <div key={index} className="border p-3 rounded-md space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`software-name-${index}`}>Software Name</Label>
                <Input
                  id={`software-name-${index}`}
                  value={option.name}
                  onChange={(e) => onOptionChange(index, 'name', e.target.value)}
                  placeholder="e.g., Dappnode"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`software-price-${index}`}>Price ($)</Label>
                <Input
                  id={`software-price-${index}`}
                  type="number"
                  value={option.price}
                  onChange={(e) => onOptionChange(index, 'price', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onRemoveOption(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}