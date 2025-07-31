import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useSidebar } from '../context/SidebarContext.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeToggleButton } from '../components/common/ThemeToggleButton';
import NotificationDropdown from '../components/header/NotificationDropdown';
import UserDropdown from '../components/header/UserDropdown.jsx';

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { uid, displayName, email, photoURL, role } = useSelector( state => state.auth);

  // Cierra el menú del header si se abre el sidebar móvil
  useEffect(() => {
    if (isMobileOpen && isApplicationMenuOpen && window.innerWidth < 1024) {
      setApplicationMenuOpen(false);
    }
  }, [isMobileOpen]);

  // Cierra el sidebar móvil si se abre el menú del header
  const handleToggleApplicationMenu = () => {
    if (!isApplicationMenuOpen && isMobileOpen && window.innerWidth < 1024) {
      toggleMobileSidebar();
    }
    setApplicationMenuOpen((prev) => !prev);
  };

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      // Si se abre el sidebar móvil, cierra el menú del header
      if (!isMobileOpen && isApplicationMenuOpen) {
        setApplicationMenuOpen(false);
      }
      toggleMobileSidebar();
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-50 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={["fas", isMobileOpen ? "xmark" : "bars"]} />
          </button>

          <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden h-8 w-auto"
              src="/logob.webp"
              alt="Logo"
            />
            <img
              className="hidden dark:block h-8 w-auto"
              src="/logow.webp"
              alt="Logo"
            />
          </Link>

          <button
            onClick={handleToggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-50 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <FontAwesomeIcon icon={["fas", "ellipsis-vertical"]} />
          </button>
        </div>

        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <NotificationDropdown />
            <ThemeToggleButton />
          </div>
          <UserDropdown uid={uid} displayName={displayName} email={email} photoURL={photoURL} role={role} />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;