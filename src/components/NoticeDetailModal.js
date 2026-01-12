"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, FileText, Tag, Users, User, Briefcase, Paperclip, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import Image from "next/image";

const API_BASE_URL = process.env.API_URL;

export default function NoticeDetailModal({ isOpen, onClose, notice }) {
  const [noticeDetails, setNoticeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && notice?._id) {
      fetchNoticeDetails(notice._id);
    } else {
      
      setNoticeDetails(null);
      setError(null);
    }
  }, [isOpen, notice?._id]);

  const fetchNoticeDetails = async (noticeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/notices/${noticeId}`, {
        timeout: 10000,
      });

      if (!response.data.status || response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch notice details");
      }

      setNoticeDetails(response.data.data.notice);
    } catch (err) {
      console.error("Error fetching notice details:", err);
      setError(err.response?.data?.message || err.message || "Failed to load notice details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  
  const getStatusDisplay = (status) => {
    const statusMap = {
      published: { label: "Published", className: "bg-green-100 text-green-700" },
      unpublished: { label: "Unpublished", className: "bg-red-100 text-red-700" },
      draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
    };
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" };
  };

  
  const getDepartmentsDisplay = (targetDepartments) => {
    if (!targetDepartments || targetDepartments.length === 0) return "N/A";
    return targetDepartments.map(d => d.name).join(", ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Notice Details</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        
        <div className="p-6">
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500">Loading notice details...</p>
            </div>
          )}

         
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-2">Error loading notice</p>
              <p className="text-gray-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchNoticeDetails(notice._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          
          {noticeDetails && !isLoading && !error && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{noticeDetails.noticeTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusDisplay(noticeDetails.status).className}`}>
                    {getStatusDisplay(noticeDetails.status).label}
                  </span>
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Publish Date</p>
                    <p className="text-sm text-gray-900 font-medium">{formatDate(noticeDetails.publishDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Notice Type</p>
                    <p className="text-sm text-gray-900 font-medium">{noticeDetails.noticeType?.name || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Target Department(s)</p>
                    <p className="text-sm text-gray-900 font-medium">{getDepartmentsDisplay(noticeDetails.targetDepartments)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Created At</p>
                    <p className="text-sm text-gray-900 font-medium">{formatDate(noticeDetails.createdAt)}</p>
                  </div>
                </div>
              </div>

              
              {noticeDetails.targetDepartments?.some(d => d.id === "INDIVIDUAL") && (
                <>
                  <div className="border-t border-gray-200" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Employee Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Employee ID</p>
                          <p className="text-sm text-gray-900 font-medium">{noticeDetails.employeeId || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Employee Name</p>
                          <p className="text-sm text-gray-900 font-medium">{noticeDetails.employeeName || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Position</p>
                          <p className="text-sm text-gray-900 font-medium">{noticeDetails.position || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

             
              <div className="border-t border-gray-200" />

              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Notice Body</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {noticeDetails.noticeBody || "No content provided."}
                  </p>
                </div>
              </div>

             
              {noticeDetails.attachments && noticeDetails.attachments.length > 0 && (
                <>
                  <div className="border-t border-gray-200" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Attachments ({noticeDetails.attachments.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {noticeDetails.attachments.map((attachment, index) => {
                        const imageUrl = `${attachment.filePath?.replace(/\\/g, '/')}`;
                        return (
                          <a
                            key={attachment._id || index}
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors"
                          >
                            <Image
                              src={imageUrl}
                              alt={attachment.fileName || `Attachment ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              width={200}
                              height={200}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            
                            <div className="hidden w-full h-full items-center justify-center bg-gray-100">
                              <div className="text-center p-2">
                                <Paperclip className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs text-gray-500 break-all">
                                  {attachment.fileName || `File ${index + 1}`}
                                </span>
                              </div>
                            </div>
                            
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white text-xs truncate">
                                {attachment.fileName || `Attachment ${index + 1}`}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              
              <div className="border-t border-gray-200 pt-4 flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
