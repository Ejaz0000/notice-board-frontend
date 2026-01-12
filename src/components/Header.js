"use client";

import React, { useState, useEffect } from "react";
import { Bell, Settings, Menu, LayoutDashboard } from "lucide-react";
import Sidebar from "./Sidebar";
import Image from "next/image";

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { day: "numeric", month: "long", year: "numeric" };
      setCurrentTime(now.toLocaleDateString("en-GB", options));
    };

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
      <header className="bg-white">
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
              <h1 className="text-sm md:text-base text-[#232948]">
                Good Afternoon Asif
              </h1>
              <p className="text-sm text-gray-600 mt-1">{currentTime}</p>
            </div>
          </div>

         
          <div className="flex items-center gap-2 md:gap-4">
            
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            

           
            <div className="hidden sm:block h-8 w-px bg-gray-400"></div>

            
            <div className="flex items-center gap-3">
              
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-[#232948]">Asif Riaj</p>
                <p className="text-xs text-gray-600">HR</p>
              </div>

              
              <Image src="/assets/account-img.jpg" className="w-9 h-9 md:w-10 md:h-10 rounded-full" alt="Logo" width="36" height="36" />
            </div>
          </div>
        </div>
      </header>

      
      <Sidebar isMobile={true} isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}
