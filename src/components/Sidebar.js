"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Clock,
  Headphones,
  Briefcase,
  FileStack,
  Bell,
  Activity,
  LogOut,
  User,
  ChevronDown,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  {
    icon: Users,
    label: "Employee",
    href: "#",
    submenu: [
      { label: "Employee Database", href: "/" },
      { label: "Add New Employee", href: "#" },
      { label: "Performance Report", href: "#" },
      { label: "Performance History", href: "#" },
    ],
  },
  { icon: DollarSign, label: "Payroll", href: "#" },
  { icon: FileText, label: "Pay Slip", href: "#" },
  { icon: Clock, label: "Attendance", href: "#" },
  { icon: Headphones, label: "Request Center", href: "#" },
  {
    icon: Briefcase,
    label: "Career Database",
    href: "#",
    submenu: [],
  },
  { icon: FileStack, label: "Document manager", href: "#" },
  { icon: Bell, label: "Notice Board", href: "/create-notice" },
  { icon: Activity, label: "Activity Log", href: "#" },
  { icon: LogOut, label: "Exit Interview", href: "#" },
  { icon: User, label: "Profile", href: "#" },
];

export default function Sidebar({ isMobile = false, isOpen = false, onClose }) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSubmenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <aside className={`w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col h-full`}>
      <div className="p-6 flex items-center">
        <div className="flex items-center  gap-3 px-3">
          <Image src="/assets/logo.png" alt="Logo" width="160" height="28" />
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenu === index;
            const isActive = pathname === item.href;

            return (
              <li key={index}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group ${
                      isActive ? "bg-gray-100" : ""
                    } ${
                      isExpanded ? "bg-gray-100 border-r-2 border-orange-500 shadow-[0_4px_6px_rgba(0,0,0,0.1)] z-50" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronDown
                      className={`ml-auto w-4 h-4 text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group ${
                      isActive ? "bg-gray-100 border-r-2 border-orange-500 shadow-[0_4px_6px_rgba(0,0,0,0.1)]" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )}

                {hasSubmenu && isExpanded && (
                  <ul className="space-y-1 bg-gray-100 pl-3 z-10 shadow-sm rounded-lg">
                    {item.submenu.map((subitem, subindex) => (
                      <li key={subindex}>
                        <Link
                          href={subitem.href}
                          onClick={handleLinkClick}
                          className={`flex items-center text-sm text-gray-600 hover:text-gray-900 py-2 hover:bg-gray-100 px-3 rounded-lg transition-colors
                            ${pathname === subitem.href ? "text-gray-900" : ""}
                            `}
                        >
                          {subitem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />

        <div
          className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
}
