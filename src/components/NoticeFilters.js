"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DEPARTMENT_OPTIONS } from "@/constants/noticeOptions";

export default function NoticeFilters({ currentFilters = {} }) {
  const router = useRouter();

  const [filters, setFilters] = useState({
    department: currentFilters.department || "",
    search: currentFilters.search || "",
    status: currentFilters.status || "",
    publishDate: currentFilters.publishDate || "",
  });

  
  useEffect(() => {
    setFilters({
      department: currentFilters.department || "",
      search: currentFilters.search || "",
      status: currentFilters.status || "",
      publishDate: currentFilters.publishDate || "",
    });
  }, [currentFilters.department, currentFilters.search, currentFilters.status, currentFilters.publishDate]);

  const buildQueryString = useCallback((filterValues) => {
    const params = new URLSearchParams();
    
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });
    
    return params.toString();
  }, []);

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== (currentFilters.search || "")) {
        const queryString = buildQueryString(filters);
        router.push(queryString ? `/?${queryString}` : "/");
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [filters.search, currentFilters.search, filters, buildQueryString, router]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    
    if (key !== "search") {
      const queryString = buildQueryString(newFilters);
      router.push(queryString ? `/?${queryString}` : "/");
    }
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      department: "",
      search: "",
      status: "",
      publishDate: "",
    };
    setFilters(emptyFilters);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-end gap-4 mb-6 py-4 w-full">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
      
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none  cursor-pointer hover:border-gray-400 transition-colors"
        >
          <option value="">Departments or individuals</option>
          {DEPARTMENT_OPTIONS.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Employee Id or Name"
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none hover:border-gray-400 transition-colors"
        />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600  cursor-pointer hover:border-gray-400 transition-colors"
        >
          <option value="">Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>

        <input
          type="date"
          value={filters.publishDate}
          onChange={(e) => handleFilterChange("publishDate", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600  cursor-pointer hover:border-gray-400 transition-colors"
        />

        <button
          onClick={handleResetFilters}
          className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg text-sm font-medium  hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
