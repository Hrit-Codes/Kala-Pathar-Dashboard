"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pageButtonClass = (isActive: boolean) =>
    `h-9 w-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
      isActive
        ? "bg-primary-700 text-white shadow-sm"
        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
    }`;

  const navButtonClass = (disabled: boolean) =>
    `h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`;

  const pageBtn = (page: number) => (
    <button key={page} onClick={() => goToPage(page)} className={pageButtonClass(page === currentPage)}>
      {page}
    </button>
  );

  const ellipsis = (key: string) => (
    <span key={key} className="px-2 text-sm font-medium text-neutral-400 select-none">
      ...
    </span>
  );

  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) buttons.push(pageBtn(i));
      return buttons;
    }

    buttons.push(pageBtn(1));

    if (currentPage > 3) {
      buttons.push(ellipsis("ellipsis-start"));
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue;
      buttons.push(pageBtn(i));
    }

    if (currentPage < totalPages - 2) {
      buttons.push(ellipsis("ellipsis-end"));
    }

    buttons.push(pageBtn(totalPages));

    return buttons;
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={navButtonClass(currentPage <= 1)}
      >
        <ArrowLeft size={15} />
      </button>

      {renderPageButtons()}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={navButtonClass(currentPage >= totalPages)}
      >
        <ArrowRight size={15} />
      </button>
    </div>
  );
}