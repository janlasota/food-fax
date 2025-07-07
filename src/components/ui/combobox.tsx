import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Custom combobox props so it can be reusable
interface ComboboxProps {
  options: { value: string; label: string; image?: string }[];
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  placeholder: string;
  checkboxClassName?: string;
  multiple?: boolean;
  multipleItemsDisplayText?: string;
  noOptionsFoundText?: string;
  width?: string | number;
  useImageUrl?: boolean;
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  checkboxClassName,
  multiple = false,
  multipleItemsDisplayText,
  noOptionsFoundText,
  width,
  useImageUrl = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const getOptionImage = (option: {
    value: string;
    label: string;
    image?: string;
  }) => {
    if (useImageUrl) {
      return option.image ? (
        <img
          src={option.image}
          alt={option.label}
          className="w-6 h-6 rounded-full"
        />
      ) : (
        <div className="text-lg">✖️</div>
      );
    }
    return <div className="text-lg">{option.image}</div>;
  };

  const getDisplayText = () => {
    if (multiple) {
      const selectedValues = value as string[];
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        return (
          options.find((option) => option.value === selectedValues[0])?.label ||
          placeholder
        );
      }
      return `${selectedValues.length} ${
        multipleItemsDisplayText ? multipleItemsDisplayText : "items"
      } selected`;
    } else {
      const singleValue = value as string;
      return singleValue
        ? options.find((option) => option.value === singleValue)?.label
        : placeholder;
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const currentValues = value as string[];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onValueChange(newValues);
    } else {
      const newValue = (value as string) === selectedValue ? "" : selectedValue;
      onValueChange(newValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between cursor-pointer", {
            "w-[200px]": !width,
          })}
          style={{ width: `${width}px` }}
        >
          {getDisplayText()}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", {
          "w-[200px]": !width,
        })}
        style={{ width: `${width}px` }}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>
              {noOptionsFoundText ?? "No options found."}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="cursor-pointer"
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  {multiple ? (
                    <Checkbox
                      checked={
                        Array.isArray(value) && value.includes(option.value)
                      }
                      className={checkboxClassName}
                    />
                  ) : (
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {getOptionImage(option)}
                    <div>{option.label}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
