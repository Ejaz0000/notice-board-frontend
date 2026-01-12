import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import NoticeFilters from "@/components/NoticeFilters";
import NoticeTable from "@/components/NoticeTable";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { notFound } from "next/navigation";

const API_BASE_URL = process.env.API_URL;

async function getNotices(searchParams) {
  try {
    const params = new URLSearchParams();

    
    if (searchParams.page) {
      params.append("page", searchParams.page);
    }
    if (searchParams.status) {
      params.append("status", searchParams.status);
    }
    if (searchParams.department) {
      params.append("department", searchParams.department);
    }
    if (searchParams.search) {
      params.append("search", searchParams.search);
    }
    if (searchParams.publishDate) {
      params.append("publishDate", searchParams.publishDate);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/notices${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url, {
      timeout: 10000, 
    });

    
    if (!response.data.status || response.data.statusCode !== 200) {
      throw new Error(response.data.message || "Failed to fetch notices");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching notices:", error.message);
    
    
    if (error.response?.status === 404) {
      notFound();
    }
    
    
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch notices");
  }
}

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const data = await getNotices(resolvedSearchParams);
  
  const { notices, pagination } = data;

 
  const activeCount = notices?.filter(n => n.status === "published").length || 0;
  const unpublishedCount = notices?.filter(n => n.status === "unpublished").length || 0;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Notice Management</h1>
          <div className="flex items-center gap-6 mt-2">
            <span className="text-sm md:text-base text-gray-600">
              <span className="text-green-600 font-semibold">Active Notices:</span> {pagination?.totalCount || 0}
            </span>
            <span className="text-sm md:text-base text-gray-600">
              <span className="text-orange-600 font-semibold">Published:</span> {activeCount}
            </span>
          </div>
        </div>

       
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/create-notice"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            Create Notice
          </Link>
          <Link
            href="/draft-notices"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-500 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm"
          >
            <FileText className="w-5 h-5" />
            All Draft Notice
          </Link>
        </div>
      </div>

      
      <NoticeFilters currentFilters={resolvedSearchParams} />

      
      <NoticeTable notices={notices || []} />

      
      {pagination && pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          currentFilters={resolvedSearchParams}
        />
      )}
    </div>
  );
}
