import Link from "next/link";
import { Plus, FileText, PenLine } from "lucide-react";
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
  
  const { notices, pagination, totalDraftCount } = data;

 
  const activeCount = notices?.length || 0;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-medium text-[#232948]">Notice Management</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm md:text-base text-[#00A46E]">
              <span className="text-[#00A46E]">Active Notices:</span> {pagination?.totalCount || 0}
            </span>
            <div className="h-4 w-px bg-gray-400"></div>
            <span className="text-sm md:text-base text-gray-600">
              <span className="text-[#FFA307]">Draft Notices: {totalDraftCount} </span>
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-[#F59E0B] hover:text-white border-2 border-[#F59E0B] rounded-lg hover:bg-[#F59E0B] transition-colors font-medium text-sm"
          >
            <PenLine className="w-5 h-5" />
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
