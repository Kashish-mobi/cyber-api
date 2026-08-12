"use client";
import { Search, Cross } from "@/app/icons";
import { cn } from "@/lib/cn";
import { useState } from "react";

function SearchBox({ placeholder, className, inputClassName }: { placeholder: string, className: string, inputClassName: string }) {
const [value, setValue] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
}
const handleClear = () => {
  setValue("");
}

  return (
    <div className="flex items-center w-full">
    <div className={cn("flex w-full items-center gap-2 rounded-[8px] bg-surface p-[16px] lg:w-[372px] 2xl:h-[56px]", className)}>
      <Search />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn("w-full bg-transparent tracking-[-0.44px] outline-none", inputClassName)}
      />
      {value && <Cross onClick={handleClear} />}
    </div>
    </div>
  )
}

export default SearchBox;