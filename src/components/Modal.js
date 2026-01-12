"use client";

import React from "react";
import { Check, AlertCircle, XCircle, X } from "lucide-react";

const iconMap = {
  success: { icon: Check, bgColor: "bg-[#10B981]", textColor: "text-green-500" },
  error: { icon: XCircle, bgColor: "bg-red-500", textColor: "text-red-500" },
  warning: { icon: AlertCircle, bgColor: "bg-yellow-500", textColor: "text-yellow-500" },
  info: { icon: AlertCircle, bgColor: "bg-blue-500", textColor: "text-blue-500" },
};

export default function Modal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  actions = [],
}) {
  if (!isOpen) return null;

  const { icon: Icon, textColor } = iconMap[type] || iconMap.success;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 md:p-12 animate-fade-in">
       
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button> */}

        
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-full ${iconMap[type].bgColor} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 text-center mb-3">
          {title}
        </h2>

        
        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          {message}
        </p>

       
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-3xl text-sm font-medium transition-colors ${
                  index === 0 && "text-blue-500 border border-blue-500 hover:bg-blue-50"
                } ${
                  index === 1 && "text-orange-500 border border-orange-500 hover:bg-orange-50"
                } ${
                  index === 2 && "text-gray-500 border border-gray-500 hover:bg-gray-50"
                }
                 `}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
