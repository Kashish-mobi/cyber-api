"use client";
import { Search, Cross } from "@/app/icons";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchBox({
  placeholder,
  className,
  inputClassName,
  enableProductSearch = false,
  onSearch,
}: {
  placeholder: string;
  className?: string;
  inputClassName?: string;
  enableProductSearch?: boolean;
  onSearch?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  };

  const handleClear = () => {
    setValue("");
    if (enableProductSearch && searchParams.get("q")) {
      router.push("/products");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableProductSearch) return;

    const term = value.trim();
    if (term) {
      router.push(`/products?q=${encodeURIComponent(term)}`);
    } else {
      router.push("/products");
    }
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full">
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-[8px] bg-surface p-[16px] lg:w-[372px] 2xl:h-[56px]",
          className
        )}
      >
        <Search />
        <input
          type="text"
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
    </form>
  );
}

export default SearchBox;
