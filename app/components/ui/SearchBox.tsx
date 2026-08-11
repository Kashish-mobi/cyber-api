import { Search } from "@/app/icons";
import { cn } from "@/lib/cn";

function SearchBox({ placeholder, className, inputClassName }: { placeholder: string, className: string, inputClassName: string }) {
  return (
    <div className="flex items-center w-full">
    <div className={cn("flex w-full items-center gap-2 rounded-[8px] bg-surface p-[16px] lg:w-[372px] 2xl:h-[56px]", className)}>
      <Search />
      <input
        type="text"
        placeholder={placeholder}
        className={cn("w-full bg-transparent tracking-[-0.44px] outline-none", inputClassName)}
      />
    </div>
    </div>
  )
}

export default SearchBox;