import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DraftNoticeTable from "@/components/DraftNoticeTable";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { notFound } from "next/navigation";

const API_BASE_URL = process.env.API_URL;

async function getDraftNotices(searchParams) {
  try {
    const params = new URLSearchParams();

    if (searchParams.page) {
      params.append("page", searchParams.page);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/notices/drafts${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    if (!response.data.status || response.data.statusCode !== 200) {
      throw new Error(response.data.message || "Failed to fetch draft notices");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching draft notices:", error.message);
    
    if (error.response?.status === 404) {
      notFound();
    }
    
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch draft notices");
  }
}

export default async function DraftNoticesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const data = await getDraftNotices(resolvedSearchParams);
  
  const { notices, pagination } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Draft Notices</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage your draft notices ({pagination?.totalCount || 0} total)
          </p>
        </div>
      </div>

      <DraftNoticeTable notices={notices || []} />

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
