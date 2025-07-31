import { SidebarProvider, useSidebar } from '../context/SidebarContext.tsx';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import AppSidebar from './AppSidebar';

// Configuración de la biblioteca de FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

const SIDEBAR_WIDTH_EXPANDED = 290;
const SIDEBAR_WIDTH_COLLAPSED = 90;

const AppLayoutContent = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Ancho del sidebar según estado
  const sidebarWidth = isExpanded || isHovered ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar Desktop */}
      <div
        className="hidden lg:block h-screen transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        style={{ width: sidebarWidth }}
      >
        <AppSidebar />
      </div>
      {/* Sidebar Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex xl:hidden">
          <div
            className="relative w-[290px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <AppSidebar />
          </div>
          <Backdrop />
        </div>
      )}
      {/* Contenido principal */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: isMobileOpen ? 0 : undefined, marginRight: 0 }}
      >
        <AppHeader />
        <div className="p-4 mx-auto w-full md:p-6">
          <Outlet />
          {children}
        </div>
      </div>
    </div>
  );
};

const AppLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;