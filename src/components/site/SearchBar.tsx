"use client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
export function SearchBar({
  value,
  onChange,
  placeholder = "Search projects...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={"search-field " + className}>
      <span className="search-field-icon" aria-hidden="true">
        <Search size={18} />
      </span>
      <Input
        aria-label="Search projects"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
}
