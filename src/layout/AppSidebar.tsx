import { useCallback, useState, useRef, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from '../context/LanguageContext';
import { useSidebar } from "../context/SidebarContext";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface SubItem {
  name: string;
  path: string;
  new?: boolean;
  pro?: boolean;
}

interface NavItem {
  icon: ReactNode;
  name: string;
  path?: string;
  subItems?: SubItem[];
  roles?: string[];
}

interface Sections {
  [key: string]: NavItem[];
}

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { role } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();

  // Secciones dinámicas del sidebar (ahora dentro del componente para tener acceso a translate)
  const sections: Sections = {
    menu: [
      {
        icon: <FontAwesomeIcon icon={["fas", "home"]} />,
        name: translate.nav.home,
        path: "/",
      },
      {
        icon: <FontAwesomeIcon icon={["fas", "users"]} />,
        name: translate.nav.family,
        path: "/familia",
      },
      {
        icon: <FontAwesomeIcon icon={["fas", "user-check"]} />,
        name: translate.nav.members,
        path: "/miembros",
      },
      {
        icon: <FontAwesomeIcon icon={["fas", "address-book"]} />,
        name: translate.nav.users,
        path: "/usuarios",
        roles: ['admin'],
      },
    ],
  };

  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<{ [key: string]: number }>({});
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cambia isActive para que detecte subrutas
  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    Object.entries(sections).forEach(([sectionName, items]) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                section: sectionName,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
    if (openSubmenu !== null) {
      const key = `${openSubmenu.section}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu, isActive]);

  const handleSubmenuToggle = (index: number, section: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.section === section &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { section, index };
    });
  };

  // Función para verificar si el usuario tiene permiso para ver un item
  const hasPermission = (item: NavItem): boolean => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.includes(role || '');
  };

  // Filtrar items del menú según permisos
  const filterMenuItems = (items: NavItem[]): NavItem[] => {
    return items.filter(hasPermission);
  };

  const renderSectionTitle = (sectionName: string, isExpanded: boolean, isHovered: boolean, isMobileOpen: boolean) => (
    <h2
      className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
        !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
      }`}
    >
      {isExpanded || isHovered || isMobileOpen ? (
        sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
      ) : (
        <FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="size-6" />
      )}
    </h2>
  );

  const renderMenuItems = (items: NavItem[], section: string) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, section)}
              className={`menu-item group ${
                openSubmenu?.section === section && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.section === section &&
                  openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <FontAwesomeIcon icon={["fas", "chevron-up"]}
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.section === section && openSubmenu?.index === index
                      ? "text-brand-500"
                      : "rotate-180"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${section}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.section === section &&
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${section}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="flex flex-col h-full px-5 bg-white dark:bg-gray-900 text-gray-900 transition-all duration-300 ease-in-out overflow-y-auto"
      onMouseEnter={() => !isExpanded && !isMobileOpen && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col py-5">
        <nav className="flex-1">
          <div className="flex flex-col gap-4">

            {/* Logo para que se vea en modo mobile */}
            <Link
              to="/"
              className={`hidden lg:flex items-center justify-center transition-all duration-300 ${
                isExpanded || isHovered || isMobileOpen ? "h-[40px]" : "h-[64px]"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                <>
                  <img
                    className="w-[32px] h-auto"
                    src="/logo.webp"
                    alt="Logo"
                  />
                </>
              ) : (
                <img
                  src="/logo.webp"
                  alt="Logo Icon"
                  className="w-[32px] h-[32px]"
                />
              )}
            </Link>
            
            {Object.entries(sections).map(([sectionName, items]) => {
              const filteredItems = filterMenuItems(items);
              
              if (filteredItems.length === 0) return null;
              
              return (
                <div key={sectionName}>
                  {renderSectionTitle(sectionName, isExpanded, isHovered, isMobileOpen)}
                  {renderMenuItems(filteredItems, sectionName)}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AppSidebar;
