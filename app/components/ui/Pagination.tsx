"use client";
import Button from "./Button";

import { LeftArrow, RightArrow, Dot } from "@/app/icons";

const Pagination = ({ totalPages, currentPage, onPageChange }: { totalPages: number, currentPage: number, onPageChange: (page: number) => void }) => {
    const pages=[];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    const activePage = currentPage;
  return (
    <div className="flex items-center justify-center gap-[16px]">
      <Button variant="ghost" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <LeftArrow width="24" height="24" />
      </Button>
      <div className="flex items-center justify-center md:gap-[10px] gap-[8px]">

{pages.slice(0, 3).map((page: number) => (
  <Button variant={activePage === page ? "active-page" : "page"} onClick={() => onPageChange(page)} disabled={currentPage === page} key={page}>{page}</Button>
))}
<div className="flex items-end self-end" key={activePage}>
<Dot key={activePage} />
</div>

{pages.slice(-1).map((page: number) => (
  <Button variant={activePage === page ? "active-page" : "page"} onClick={() => onPageChange(page)} disabled={currentPage === page} key={page}>{page}</Button>
))}
</div>

      <Button variant="ghost" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <RightArrow width="24" height="24" />
      </Button>
    </div>
  )
}

export default Pagination;