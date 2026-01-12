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
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Filter by:
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Departments or individuals</option>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            &nbsp;
          </label>
          <input
            type="text"
            placeholder="Employee Id or Name"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            &nbsp;
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

      
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            &nbsp;
          </label>
          <input
            type="date"
            value={filters.publishDate}
            onChange={(e) => handleFilterChange("publishDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            &nbsp;
          </label>
          <button
            onClick={handleResetFilters}
            className="w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
