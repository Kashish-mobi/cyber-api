"use client";

import { cn } from "@/lib/cn";

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
};

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  tabClassName,
}: TabsProps) {
  return (
    <div
      className={cn(
        "mb-[26px] flex w-full items-center gap-[32px] overflow-x-auto scrollbar-hide 2xl:mb-[32px]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "whitespace-nowrap text-[18px] font-[500] leading-[32px] tracking-[-1.2px] md:tracking-[0] cursor-pointer",
              isActive
                ? "border-b-[2px] border-primary text-primary"
                : "text-muted-alt",
              tabClassName
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
