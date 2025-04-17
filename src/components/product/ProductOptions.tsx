import { Settings, HardDrive, Cpu } from 'lucide-react';
import { NodeConfig } from '../../types';

interface ProductOptionsProps {
  config: NodeConfig;
  onChange: (config: NodeConfig) => void;
  options: any
}

export default function ProductOptions({ config, onChange, options}: ProductOptionsProps) {
  const handleChange = (key: keyof NodeConfig, value: string) => {
    onChange({ ...config, [key]: value });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5 text-green-500" />
        <select
          value={config.software}
          onChange={(e) => handleChange('software', e.target.value)}
          className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
        >
          {options?.software.map((software: any) => (
            <option key={software._id} value={software.name}>{software.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <HardDrive className="h-5 w-5 text-green-500" />
        <select
          value={config.ram}
          onChange={(e) => handleChange('ram', e.target.value)}
          className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
        >
          {options?.ram.map((ram: any) => (
            <option key={ram._id} value={ram.size}>{ram?.size} {ram?.price > 0 ? ` (+$ ${ram?.price})` : ''}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <HardDrive className="h-5 w-5 text-green-500" />
        <select
          value={config.storage}
          onChange={(e) => handleChange('storage', e.target.value)}
          className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
        >
          {options?.storage.map((storage: any) => (
            <option key={storage._id} value={storage.type}>{storage?.type} {storage?.price > 0 ? ` (+$ ${storage?.price})` : ''}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Cpu className="h-5 w-5 text-green-500" />
        <select
          value={config.processor}
          onChange={(e) => handleChange('processor', e.target.value)}
          className="flex-1 rounded border-gray-300 focus:border-green-500 focus:ring-green-500"
        >
          {options?.processor.map((processor: any) => (
            <option key={processor._id} value={processor.model}>{processor?.model} {processor?.price > 0 ? ` (+$ ${processor?.price})` : ''}</option>
          ))}
        </select>
      </div>
    </div>
  );
}