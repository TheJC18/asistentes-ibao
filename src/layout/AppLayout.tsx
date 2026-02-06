import { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@/core/context/SidebarContext';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/layout/AppHeader';
import Backdrop from '@/layout/Backdrop';
import AppSidebar from '@/layout/AppSidebar';

// Configuración de la biblioteca de FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, far, fab);

const SIDEBAR_WIDTH_EXPANDED = 290;
const SIDEBAR_WIDTH_COLLAPSED = 90;

interface AppLayoutContentProps {
  children?: ReactNode;
}

const AppLayoutContent = ({ children }: AppLayoutContentProps) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Ancho del sidebar según estado
  const sidebarWidth = isExpanded || isHovered ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Desktop - Columna fija a la izquierda */}
      <aside
        className="hidden lg:block fixed top-0 left-0 h-screen overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        <AppSidebar />
      </aside>
      
      {/* Sidebar Mobile Overlay */}
      {isMobileOpen && (
        <>
          <Backdrop />
          <aside className="fixed top-0 left-0 h-screen w-[290px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 overflow-y-auto lg:hidden">
            <AppSidebar />
          </aside>
        </>
      )}
      
      {/* Contenido principal - Se ajusta con margin al sidebar */}
      <div 
        className="min-h-screen flex flex-col transition-all duration-300 lg:ml-[var(--sidebar-width)]"
        style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;
