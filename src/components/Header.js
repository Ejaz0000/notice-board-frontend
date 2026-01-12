"use client";

import React, { useState, useEffect } from "react";
import { Bell, Settings, Menu, LayoutDashboard } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    const updateTime = () => {
      const now = new Date();
      const options = { day: "numeric", month: "long", year: "numeric" };
      setCurrentTime(now.toLocaleDateString("en-GB", options));
    };

    updateGreeting();
    updateTime();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          
          <div className="flex items-center gap-3">
            
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            
            <div className="flex lg:hidden items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
            </div>

           
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {greeting} <span className="text-blue-600">Asif</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">{currentTime}</p>
            </div>
          </div>

         
          <div className="flex items-center gap-2 md:gap-4">
            
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            
            <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-6 h-6" />
            </button>

           
            <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-xs md:text-sm">AR</span>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">Asif Riaj</p>
                <p className="text-xs text-gray-500">HR Manager</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      
      <Sidebar isMobile={true} isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}
