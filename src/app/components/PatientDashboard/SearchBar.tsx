import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Input
        type="text"
        placeholder="Search reports..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm bg-white/70 dark:bg-gray-900/70"
      />
      <Button variant="secondary">Search</Button>
    </div>
  );
};