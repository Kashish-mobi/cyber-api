"use client";
import { Search, Cross } from "@/app/icons";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "./Button";
import { useProductFilters } from "@/redux/useProductFilters";

function SearchBox({
  placeholder,
  className,
  inputClassName,
  enableProductSearch = false,
  showSearchButton = false,
  onSearch,
  onValueChange,
}: {
  placeholder: string;
  className?: string;
  inputClassName?: string;
  enableProductSearch?: boolean;
  showSearchButton?: boolean;
  onSearch?: () => void;
  onValueChange?: (value: string) => void;
}) {
  const searchParams = useSearchParams();
  const { applyFilters } = useProductFilters();
  const queryFromUrl = searchParams.get("q") || "";
  const [value, setValue] = useState(
    enableProductSearch ? queryFromUrl : ""
  );

  useEffect(() => {
    if (enableProductSearch) {
      setValue(queryFromUrl);
    }
  }, [queryFromUrl, enableProductSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onValueChange?.(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onValueChange?.("");
    if (enableProductSearch && queryFromUrl) {
      applyFilters({ q: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableProductSearch) return;

    applyFilters({ q: value.trim() });
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[12px]">
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-[8px] bg-surface p-[16px] lg:w-[372px] 2xl:h-[56px]",
          className
        )}
      >
        <Search />
        <input
          type="search"
          enterKeyHint="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full bg-transparent tracking-[-0.44px] outline-none",
            inputClassName
          )}
        />
        {value && <Cross onClick={handleClear} />}
      </div>
      {showSearchButton && (
        <Button
          type="submit"
          variant="fill-dark"
          className="!h-[48px] w-full !min-w-0"
        >
          Search
        </Button>
      )}
    </form>
  );
}

export default SearchBox;
