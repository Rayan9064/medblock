import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/icons/search";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder="Search reports..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 focus:bg-white/20 dark:focus:bg-gray-800/20 transition-colors"
      />
    </div>
  );
}