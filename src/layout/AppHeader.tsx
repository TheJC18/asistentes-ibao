import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useSidebar } from '@/core/context/SidebarContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserDropdown from '@/core/components/header/UserDropdown';
import { RootState } from '@/core/store';

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { uid, displayName, email, photoURL, role } = useSelector((state: RootState) => state.auth);

  // Cierra el menú del header si se abre el sidebar móvil
  useEffect(() => {
    if (isMobileOpen && isApplicationMenuOpen && window.innerWidth < 1024) {
      setApplicationMenuOpen(false);
    }
  }, [isMobileOpen, isApplicationMenuOpen]);

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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 w-full bg-card border-b border-border z-20">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center w-10 h-10 text-text-secondary rounded-lg hover:bg-surface-hover lg:border lg:border-border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={["fas", isMobileOpen ? "xmark" : "bars"]} />
          </button>

          <Link to="/" className="lg:hidden">
            <img className="h-8 w-auto" src="/logo.webp" alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <UserDropdown 
            uid={uid || ''} 
            displayName={displayName || ''} 
            email={email || ''} 
            photoURL={photoURL || ''} 
            role={role || ''} 
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
