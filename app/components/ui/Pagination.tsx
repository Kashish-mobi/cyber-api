"use client";
import Button from "./Button";

import { LeftArrow, RightArrow, Dot } from "@/app/icons";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const showDots = totalPages > 5;
  const visiblePages = showDots
    ? [1, 2]
    : Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-[16px]">
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <LeftArrow width="24" height="24" />
      </Button>

      <div className="flex items-center justify-center md:gap-[10px] gap-[8px]">
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "active-page" : "page"}
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
          >
            {page}
          </Button>
        ))}

        {showDots && (
          <>
            <div className="flex items-end self-end">
              <Dot />
            </div>
            <Button
              variant={currentPage === totalPages ? "active-page" : "page"}
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <RightArrow width="24" height="24" />
      </Button>
    </div>
  );
};

export default Pagination;
