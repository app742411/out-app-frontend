import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Management",
    path: "/users",
  },
  {
    icon: <UserCircleIcon />,
    name: "Service Providers",
    path: "/vendors",
  },
  {
    icon: <GridIcon />,
    name: "Property Management",
    subItems: [
      { name: "Property List", path: "/properties", pro: false },
      { name: "Setup Property", path: "/property-setup", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Service Management",
    subItems: [
      { name: "Services List", path: "/service-management", pro: false },
      { name: "Services Setup", path: "/service-setup", pro: false },
      // { name: "Package List", path: "/packages", pro: false },
    ],
  },
  {
    name: "Booking Management",
    icon: <CalenderIcon />,
    subItems: [
      { name: "All Bookings", path: "/bookings", pro: false },
      { name: "Upcoming Bookings", path: "/bookings/upcoming", pro: false },
      { name: "Completed Bookings", path: "/bookings/completed", pro: false },
      { name: "Cancelled Bookings", path: "/bookings/cancelled", pro: false },
      { name: "Refund Requests", path: "/bookings/refunds", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Coupon Management",
    path: "/coupanmange",
  },
  {
    icon: <PieChartIcon />,
    name: "Finance & Commission",
    subItems: [
      { name: "Commission & Platform Fee", path: "/finance-settings", pro: false },
      { name: "Service Provider Payouts", path: "/vendor-payouts", pro: false },
      { name: "Earnings Report", path: "/earnings-report", pro: false },
      { name: "Transaction Logs", path: "/transaction-logs", pro: false },
      { name: "Cancellation Policies", path: "/cancellation-policies", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "App Management",
    path: "/app-manage",
  }
];

const othersItems = [
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: <PageIcon />,
    name: "Support",
    path: "/support",
  },
  {
    icon: <TableIcon />,
    name: "Reports",
    path: "/reports",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Notification",
    path: "/notifications",
  },
  {
    icon: <PlugInIcon />,
    name: "Settings",
    path: "/settings",
  }
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => path && location.pathname === path,
    [location.pathname]
  );

  // Open submenu that contains current route on mount / route change
  useEffect(() => {
    let submenuMatched = false;

    const checkItems = (items, menuType) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    };

    checkItems(navItems, "main");
    checkItems(othersItems, "others");

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, isActive]);

  // Measure submenu height when opened
  useEffect(() => {
    if (!openSubmenu) return;
    const key = `${openSubmenu.type}-${openSubmenu.index}`;
    const el = subMenuRefs.current[key];
    setSubMenuHeight((prevHeights) => ({
      ...prevHeights,
      [key]: el ? el.scrollHeight : 0,
    }));
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={`${menuType}-${index}`} className="relative">
          {nav.subItems ? (
            <>
              <button
                type="button"
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span
                  className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
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
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                      }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                            }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
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
            </>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
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
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
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
      <div
        className={`pt-8 pb-2 flex justify-center ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-light.png"
                alt="Logo"
                width={40}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-dark.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
