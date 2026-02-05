import { useCallback, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "../context/SidebarContext.tsx";
import { useSelector } from "react-redux";

// Secciones dinámicas del sidebar
const sections = {
  menu: [
    {
      icon: <FontAwesomeIcon icon={["fas", "home"]} />, // Ícono sólido
      name: "Inicio",
      path: "/",
    },
    {
      icon: <FontAwesomeIcon icon={["fas", "users"]} />, // Ícono sólido
      name: "Mi Familia",
      path: "/familia",
    },
    {
      icon: <FontAwesomeIcon icon={["fas", "user-check"]} />, // Ícono sólido
      name: "Miembros",
      path: "/miembros",
    },
    {
      icon: <FontAwesomeIcon icon={["fas", "address-book"]} />, // Ícono sólido
      name: "Usuarios",
      path: "/usuarios",
      roles: ['admin'], // Solo visible para admin
    },
  ],
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { role } = useSelector((state) => state.auth); // Obtener rol del usuario

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // Cambia isActive para que detecte subrutas
  const isActive = useCallback(
    (path) => location.pathname === path || location.pathname.startsWith(path + "/"),
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
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, section) => {
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
  const hasPermission = (item) => {
    // Si no tiene roles especificados, es visible para todos
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    // Verificar si el rol del usuario está en la lista de roles permitidos
    return item.roles.includes(role);
  };

  // Filtrar items del menú según permisos
  const filterMenuItems = (items) => {
    return items.filter(hasPermission);
  };

  const renderSectionTitle = (sectionName, isExpanded, isHovered, isMobileOpen) => (
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

  const renderMenuItems = (items, section) => (
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
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mt-5 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
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
                    className="dark:hidden w-[32px] h-auto"
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
              
              // No mostrar la sección si no hay items visibles
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
    </aside>
  );
};

export default AppSidebar;