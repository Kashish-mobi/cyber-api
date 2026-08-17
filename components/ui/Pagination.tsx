"use client";

import Button from "./Button";
import { LeftArrow, RightArrow, Dot } from "@/icons";

function getPaginationItems(totalPages: number, currentPage: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, currentPage, totalPages]);

  if (totalPages >= 2) {
    pages.add(2);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: Array<number | "dots"> = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      items.push("dots");
    }

    items.push(sorted[i]);
  }

  return items;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const items = getPaginationItems(totalPages, currentPage);

  const changePage = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center gap-[16px]">
      <Button
        variant="ghost"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <LeftArrow width="24" height="24" />
      </Button>

      <div className="flex items-center justify-center md:gap-[10px] gap-[8px]">
        {items.map((item, index) =>
          item === "dots" ? (
            <div
              key={`dots-${index}`}
              className="flex items-end self-end"
            >
              <Dot />
            </div>
          ) : (
            <Button
              key={item}
              variant={currentPage === item ? "active-page" : "page"}
              onClick={() => changePage(item)}
              disabled={currentPage === item}
            >
              {item}
            </Button>
          )
        )}
      </div>

      <Button
        variant="ghost"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <RightArrow width="24" height="24" />
      </Button>
    </div>
  );
};

export default Pagination;