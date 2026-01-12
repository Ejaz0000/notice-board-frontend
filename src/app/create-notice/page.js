"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ChevronLeft,
  ChevronDown,
  Upload,
  Paperclip,
  X,
  Check,
  Loader2,
} from "lucide-react";
import Modal from "@/components/Modal";
import { NOTICE_TYPE_OPTIONS, DEPARTMENT_OPTIONS } from "@/constants/noticeOptions";

const API_BASE_URL = process.env.API_URL;

const employeeIdOptions = [
  "EMP001",
  "EMP002",
  "EMP003",
  "EMP004",
  "EMP005",
  "EMP006",
];

export default function CreateNoticePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    targetType: "ALL_DEPARTMENTS",
    selectedDepartments: [],
    noticeTitle: "",
    employeeId: "",
    employeeName: "",
    position: "",
    noticeType: "",
    publishDate: "",
    noticeBody: "",
    attachments: [],
  });

  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showNoticeTypeDropdown, setShowNoticeTypeDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftSuccessModal, setShowDraftSuccessModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.targetType === "INDIVIDUAL") {
      if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
      if (!formData.employeeName) newErrors.employeeName = "Employee Name is required";
      if (!formData.position) newErrors.position = "Position is required";
    }

    if (formData.targetType !== "INDIVIDUAL" && formData.targetType !== "ALL_DEPARTMENTS" && formData.selectedDepartments.length === 0) {
      newErrors.departments = "Select at least one department";
    }

    if (!formData.noticeTitle) newErrors.noticeTitle = "Notice Title is required";
    if (!formData.noticeBody) newErrors.noticeBody = "Notice Body is required";
    if (!formData.noticeType) newErrors.noticeType = "Notice Type is required";
    if (!formData.publishDate) {
      newErrors.publishDate = "Publish Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.publishDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.publishDate = "Publish Date cannot be before today";
      }
    }

    if (formData.attachments.length > 5) {
      newErrors.attachments = "Maximum 5 files allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTargetSelect = (option) => {
    if (option.id === "ALL_DEPARTMENTS") {
      setFormData({ 
        ...formData, 
        targetType: "ALL_DEPARTMENTS", 
        selectedDepartments: [],
        employeeId: "",
        employeeName: "",
        position: ""
      });
    } else if (option.id === "INDIVIDUAL") {
      setFormData({ 
        ...formData, 
        targetType: "INDIVIDUAL", 
        selectedDepartments: [] 
      });
    } else {
      if (!formData.selectedDepartments.find((d) => d.id === option.id)) {
        setFormData({
          ...formData,
          targetType: "DEPARTMENT",
          selectedDepartments: [...formData.selectedDepartments, option],
          employeeId: "",
          employeeName: "",
          position: ""
        });
      }
    }
    setShowTargetDropdown(false);
  };

  const removeDepartment = (deptId) => {
    const updated = formData.selectedDepartments.filter((d) => d.id !== deptId);
    setFormData({
      ...formData,
      selectedDepartments: updated,
      targetType: updated.length === 0 ? "ALL_DEPARTMENTS" : "DEPARTMENT",
    });
  };

  const handleEmployeeSelect = (employeeId) => {
    setFormData({
      ...formData,
      employeeId: employeeId,
    });
    setShowEmployeeDropdown(false);
  };

  const handleNoticeTypeSelect = (type) => {
    setFormData({ ...formData, noticeType: type.id });
    setShowNoticeTypeDropdown(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = formData.attachments.length + files.length;
    
    if (totalFiles > 5) {
      setErrors({ ...errors, attachments: "Maximum 5 files allowed" });
      return;
    }
    
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files],
    });
    setErrors({ ...errors, attachments: "" });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const totalFiles = formData.attachments.length + files.length;
    
    if (totalFiles > 5) {
      setErrors({ ...errors, attachments: "Maximum 5 files allowed" });
      return;
    }
    
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files],
    });
    setErrors({ ...errors, attachments: "" });
  };

  const removeAttachment = (index) => {
    const updated = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: updated });
  };

  const getNoticeTypeName = (id) => {
    const type = NOTICE_TYPE_OPTIONS.find((t) => t.id === id);
    return type ? type.name : "Select Notice Type";
  };

  const submitForm = async (endpoint = "/api/notices", isDraft = false) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const submitData = new FormData();

      submitData.append("noticeTitle", formData.noticeTitle);
      submitData.append("noticeBody", formData.noticeBody);
      submitData.append("noticeType", formData.noticeType);
      submitData.append("publishDate", formData.publishDate);

      if (formData.targetType === "INDIVIDUAL") {
        submitData.append("targetDepartments[]", "INDIVIDUAL");
        submitData.append("employeeId", formData.employeeId);
        submitData.append("employeeName", formData.employeeName);
        submitData.append("position", formData.position);
      } else if (formData.targetType === "ALL_DEPARTMENTS") {
        submitData.append("targetDepartments[]", "ALL_DEPARTMENTS");
      } else if (formData.selectedDepartments.length > 0) {
        formData.selectedDepartments.forEach((dept) => {
          submitData.append("targetDepartments[]", dept.id);
        });
      }

      formData.attachments.forEach((file) => {
        submitData.append("attachments", file);
      });

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        if (isDraft) {
          setShowDraftSuccessModal(true);
        } else {
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response) {
        const { data } = error.response;

        if (data.errors && typeof data.errors === "object") {
          const fieldErrors = {};
          Object.keys(data.errors).forEach((key) => {
            fieldErrors[key] = data.errors[key];
          });
          setErrors(fieldErrors);
        } else if (data.message) {
          setApiError(data.message);
        } else {
          setApiError("An error occurred while submitting the form. Please try again.");
        }
      } else if (error.request) {
        setApiError("Unable to connect to the server. Please check your internet connection.");
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => {
    submitForm("/api/notices");
  };

  const handleSaveDraft = () => {
    submitForm("/api/notices/drafts", true);
  };

  const handleCancel = () => {
    router.push("/");
  };

  const resetForm = () => {
    setFormData({
      targetType: "ALL_DEPARTMENTS",
      selectedDepartments: [],
      noticeTitle: "",
      employeeId: "",
      employeeName: "",
      position: "",
      noticeType: "",
      publishDate: "",
      noticeBody: "",
      attachments: [],
    });
    setErrors({});
    setApiError("");
  };

  return (
    <div className="min-h-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Create a Notice</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <p className="text-gray-700 font-medium mb-6">Please fill in the details below</p>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> Target Department(s) or Individual
          </label>
          <div className="relative">
            <div
              type="button"
              onClick={() => setShowTargetDropdown(!showTargetDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors bg-blue-500 text-white"
            >
              <div className="flex flex-wrap gap-2 items-center">
                {formData.selectedDepartments.length > 0 ? (
                  formData.selectedDepartments.map((dept) => (
                    <span
                      key={dept.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm rounded-md"
                    >
                      {dept.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDepartment(dept.id);
                        }}
                        className="hover:bg-orange-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))
                ) : formData.targetType === "INDIVIDUAL" ? (
                  <span>Individual</span>
                ) : (
                  <span>All Departments</span>
                )}
              </div>
              <ChevronDown className="w-5 h-5 shrink-0" />
            </div>

            {showTargetDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {DEPARTMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleTargetSelect(option)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-between text-gray-700"
                  >
                    {option.name}
                    {(option.id === "ALL_DEPARTMENTS" && formData.targetType === "ALL_DEPARTMENTS") ||
                    (option.id === "INDIVIDUAL" && formData.targetType === "INDIVIDUAL") ||
                    formData.selectedDepartments.find((d) => d.id === option.id) ? (
                      <Check className="w-4 h-4 text-blue-500" />
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.departments && (
            <p className="text-red-500 text-xs mt-1">{errors.departments}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> Notice Title
          </label>
          <input
            type="text"
            placeholder="Write the Title of Notice"
            value={formData.noticeTitle}
            onChange={(e) => setFormData({ ...formData, noticeTitle: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.noticeTitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.noticeTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.noticeTitle}</p>
          )}
        </div>

        {formData.targetType === "INDIVIDUAL" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Select Employee ID
              </label>
              <button
                type="button"
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg text-sm ${
                  errors.employeeId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <span className={formData.employeeId ? "text-gray-900" : "text-gray-400"}>
                  {formData.employeeId || "Select employee designation"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showEmployeeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {employeeIdOptions.map((empId) => (
                    <button
                      key={empId}
                      type="button"
                      onClick={() => handleEmployeeSelect(empId)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                    >
                      {empId}
                    </button>
                  ))}
                </div>
              )}
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Employee Name
              </label>
              <input
                type="text"
                placeholder="Enter employee full name"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employeeName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.employeeName && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Position
              </label>
              <input
                type="text"
                placeholder="Enter employee position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.position ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">{errors.position}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Notice Type
            </label>
            <button
              type="button"
              onClick={() => setShowNoticeTypeDropdown(!showNoticeTypeDropdown)}
              className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg text-sm ${
                errors.noticeType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <span className={formData.noticeType ? "text-gray-900" : "text-gray-400"}>
                {getNoticeTypeName(formData.noticeType)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showNoticeTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                {NOTICE_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleNoticeTypeSelect(type)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
                  >
                    {type.name}
                    {formData.noticeType === type.id && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
            {errors.noticeType && (
              <p className="text-red-500 text-xs mt-1">{errors.noticeType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Publish Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.publishDate ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Select Publishing Date"
              />
            </div>
            {errors.publishDate && (
              <p className="text-red-500 text-xs mt-1">{errors.publishDate}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> Notice Body
          </label>
          <textarea
            placeholder="Write the details about notice"
            rows={4}
            value={formData.noticeBody}
            onChange={(e) => setFormData({ ...formData, noticeBody: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.noticeBody ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.noticeBody && (
            <p className="text-red-500 text-xs mt-1">{errors.noticeBody}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Attachments (optional, max 5 files)
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-green-50 transition-colors ${
              errors.attachments ? "border-red-300" : "border-green-300"
            }`}
          >
            <Upload className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm">
              <span className="text-green-500 font-medium">Upload</span>
              <span className="text-gray-600"> nominee profile image or drag and drop.</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Accepted File Type: jpg, png</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {errors.attachments && (
            <p className="text-red-500 text-xs mt-1">{errors.attachments}</p>
          )}

          {formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2.5 border-2 border-green-500 text-green-500 rounded-full hover:bg-green-50 transition-colors font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save as Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Publish Notice
          </button>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Notice Published Successfully"
        message={`Your notice "${formData.noticeTitle || "Notice"}" has been published and is now visible to all selected departments.`}
        actions={[
          {
            label: "View Notice",
            variant: "secondary",
            onClick: () => {
              setShowSuccessModal(false);
              router.push("/");
            },
          },
          {
            label: "+ Create Another",
            variant: "secondary",
            onClick: () => {
              setShowSuccessModal(false);
              resetForm();
            },
          },
          {
            label: "Close",
            variant: "outline",
            onClick: () => {
              setShowSuccessModal(false);
            },
          },
        ]}
      />

      <Modal
        isOpen={showDraftSuccessModal}
        onClose={() => setShowDraftSuccessModal(false)}
        type="success"
        title="Draft Saved Successfully"
        message={`Your notice "${formData.noticeTitle || "Notice"}" has been saved as a draft. You can publish it later from the drafts page.`}
        actions={[
          {
            label: "View Drafts",
            variant: "secondary",
            onClick: () => {
              setShowDraftSuccessModal(false);
              router.push("/draft-notices");
            },
          },
          {
            label: "+ Create Another",
            variant: "secondary",
            onClick: () => {
              setShowDraftSuccessModal(false);
              resetForm();
            },
          },
          {
            label: "Close",
            variant: "outline",
            onClick: () => {
              setShowDraftSuccessModal(false);
            },
          },
        ]}
      />
    </div>
  );
}
