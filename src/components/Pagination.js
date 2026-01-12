"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowBigLeft, ChevronLeft, ChevronRight, MoveLeft, MoveRight } from "lucide-react";

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  hasNextPage = false, 
  hasPrevPage = false,
  currentFilters = {} 
}) {
  const router = useRouter();

  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const navigateToPage = (page) => {
    const params = new URLSearchParams();
    
    
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    
    
    if (page > 1) {
      params.set("page", page.toString());
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handlePreviousPage = () => {
    if (hasPrevPage) {
      navigateToPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      navigateToPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      navigateToPage(page);
    }
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pb-4">
      
      <button
        onClick={handlePreviousPage}
        disabled={!hasPrevPage}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MoveLeft className="w-5 h-5" />
      </button>

      
      {pages.map((page, index) => (
        <button
          key={`${page}-${index}`}
          onClick={() => handlePageClick(page)}
          disabled={page === "..."}
          className={`min-w-10 h-10 rounded-lg font-medium transition-colors ${
            page === currentPage
              ? "border border-blue-600 text-blue-600"
              : page === "..."
              ? "text-gray-400 cursor-default"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      
      <button
        onClick={handleNextPage}
        disabled={!hasNextPage}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MoveRight className="w-5 h-5" />
      </button>
    </div>
  );
}
