import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SecurityGuard from './SecurityGuard';
import { useAuth } from '../context/AuthContext';
import AICopilot from './AICopilot';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  // Dynamic spacing between KPI cards and main tables/data grids based on viewport height
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateDynamicSpacing = (height: number): string => {
    if (height > 1000) return '32px'; // High-res displays
    if (height < 720) return '16px';  // Compact laptops or smaller viewports
    return '24px';                    // Default standard Full HD
  };

  const dynamicSpacing = calculateDynamicSpacing(windowHeight);

  return (
    <SecurityGuard>
      <div 
        className="flex h-screen w-full bg-[#F9F7F6] overflow-hidden relative"
        style={{ '--sys-kpi-table-gap': dynamicSpacing } as React.CSSProperties}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto w-full flex flex-col">
            <Outlet />
          </main>
        </div>
        <AICopilot />
      </div>
    </SecurityGuard>
  );
}
