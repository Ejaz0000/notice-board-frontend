"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, MoreVertical, Loader2 } from "lucide-react";
import axios from "axios";
import NoticeDetailModal from "./NoticeDetailModal";

const API_BASE_URL = process.env.API_URL;

export default function NoticeTable({ notices: initialNotices = [] }) {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingRow, setEditingRow] = useState(null);
  const [notices, setNotices] = useState(initialNotices);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); 
  const [statusError, setStatusError] = useState(null);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    setNotices(initialNotices);
    setSelectedRows(new Set());
  }, [initialNotices]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setEditingRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const togglePublishStatus = async (index) => {
    const notice = notices[index];
    const newStatus = notice.status === "published" ? "unpublished" : "published";
    
    setUpdatingStatus(notice._id);
    setStatusError(null);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/notices/${notice._id}/status`,
        { status: newStatus },
        { timeout: 10000 }
      );

      if (!response.data.status || response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to update status");
      }

    
      const updated = [...notices];
      updated[index].status = newStatus;
      setNotices(updated);

      
      setEditingRow(null);

      
      router.refresh();
    } catch (error) {
      console.error("Error updating notice status:", error);
      setStatusError({
        noticeId: notice._id,
        message: error.response?.data?.message || error.message || "Failed to update status"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setIsDetailModalOpen(true);
  };

  const isAllSelected = selectedRows.size === notices.length && notices.length > 0;

  
  const getDepartmentDisplay = (targetDepartments) => {
    if (!targetDepartments || targetDepartments.length === 0) {
      return { text: "N/A", color: "text-gray-600" };
    }
    
    const dept = targetDepartments[0];
    const deptId = dept.id;
    
    
    const colorMap = {
      ALL_DEPARTMENTS: "text-blue-600",
      INDIVIDUAL: "text-purple-600",
      SALES: "text-orange-600",
      MARKETING: "text-green-600",
      IT: "text-blue-600",
      HR: "text-red-600",
    };

    if (targetDepartments.length > 1) {
      return {
        text: `${dept.name} +${targetDepartments.length - 1} more`,
        color: colorMap[deptId] || "text-gray-600",
      };
    }

    return {
      text: dept.name,
      color: colorMap[deptId] || "text-gray-600",
    };
  };

  
  const getStatusDisplay = (status) => {
    const statusMap = {
      published: { label: "Published", className: "bg-green-100 text-green-700" },
      unpublished: { label: "Unpublished", className: "bg-red-100 text-red-700" },
      draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
    };
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" };
  };

  if (notices.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-lg">No notices found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new notice</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
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
            {notices.map((notice, index) => {
              const deptDisplay = getDepartmentDisplay(notice.targetDepartments);
              const statusDisplay = getStatusDisplay(notice.status);
              const isPublished = notice.status === "published";

              return (
                <tr
                  key={notice._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
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
                    <p className={`text-sm font-medium ${deptDisplay.color}`}>
                      {deptDisplay.text}
                    </p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{notice.publishDate}</p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${statusDisplay.className}`}
                    >
                      {statusDisplay.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      
                      <button
                        onClick={() => handleViewNotice(notice)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </button>

                      
                      <div className="relative" ref={editingRow === index ? dropdownRef : null}>
                        <button
                          onClick={() =>
                            setEditingRow(editingRow === index ? null : index)
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        
                        {editingRow === index && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                            <div className="flex items-center justify-between gap-3 px-4 py-3">
                              <span className="text-sm text-gray-700">
                                {isPublished ? "Published" : "Unpublished"}
                              </span>
                              <button
                                onClick={() => togglePublishStatus(index)}
                                disabled={updatingStatus === notice._id}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  updatingStatus === notice._id
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : isPublished
                                    ? "bg-green-500"
                                    : "bg-gray-600"
                                }`}
                              >
                                {updatingStatus === notice._id ? (
                                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin mx-auto" />
                                ) : (
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      isPublished ? "translate-x-6" : "translate-x-1"
                                    }`}
                                  />
                                )}
                              </button>
                            </div>
                          
                            {statusError?.noticeId === notice._id && (
                              <div className="px-4 pb-3">
                                <p className="text-xs text-red-600">{statusError.message}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
      <NoticeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        notice={selectedNotice}
      />
    </div>
  );
}
