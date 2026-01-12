"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Upload, MoreVertical, Loader2 } from "lucide-react";
import axios from "axios";
import NoticeDetailModal from "@/components/NoticeDetailModal";

const API_BASE_URL = process.env.API_URL;

export default function DraftNoticeTable({ notices: initialNotices = [] }) {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [notices, setNotices] = useState(initialNotices);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setNotices(initialNotices);
    setSelectedRows(new Set());
  }, [initialNotices]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(notices.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setIsDetailModalOpen(true);
  };

  const handleUploadDraft = async (notice) => {
    try {
      setPublishingId(notice._id);
      setError(null);

      const response = await axios.patch(
        `${API_BASE_URL}/api/notices/drafts/${notice._id}/publish`,
        {},
        { timeout: 10000 }
      );

      if (!response.data.status || response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to publish notice");
      }

      router.refresh();
    } catch (err) {
      console.error("Error publishing notice:", err.message);
      setError(
        err.response?.data?.message || err.message || "Failed to publish notice"
      );
    } finally {
      setPublishingId(null);
    }
  };

  const getDepartmentColor = (departments) => {
    if (!departments || departments.length === 0) return "text-gray-600";
    
    const dept = departments[0].name.toLowerCase();
    if (dept.includes("hr")) return "text-red-600";
    if (dept.includes("it")) return "text-purple-600";
    if (dept.includes("individual")) return "text-blue-600";
    if (dept.includes("all")) return "text-blue-600";
    return "text-gray-600";
  };

  const formatDepartments = (departments) => {
    if (!departments || departments.length === 0) return "N/A";
    if (departments.length === 1) return departments[0].name;
    return `${departments[0].name} +${departments.length - 1}`;
  };

  const isAllSelected = selectedRows.size === notices.length && notices.length > 0;

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Notice Type
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Department/Individual
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Published On
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No draft notices found
                  </td>
                </tr>
              ) : (
                notices.map((notice, index) => (
                  <tr
                    key={notice._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => toggleSelectRow(index)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900 max-w-xs">{notice.noticeTitle}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{notice.noticeType?.name || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className={`text-sm font-medium ${getDepartmentColor(notice.targetDepartments)}`}>
                        {formatDepartments(notice.targetDepartments)}
                      </p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{notice.publishDate}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          notice.status === "published"
                            ? "bg-green-100 text-green-700"
                            : notice.status === "unpublished"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {notice.status === "draft" ? "Draft" : notice.status === "published" ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewNotice(notice)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View notice"
                        >
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        <button
                          onClick={() => handleUploadDraft(notice)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Publish draft"
                          disabled={publishingId === notice._id}
                        >
                          {publishingId === notice._id ? (
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </button>

                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NoticeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        notice={selectedNotice}
      />
    </>
  );
}
