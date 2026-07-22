import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { logout } from "../api/authApi";
import LogoutModal from "../components/common/LogoutModal";

// Modern Lucide Icons
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Wrench,
  CalendarDays,
  Ticket,
  Coins,
  SlidersHorizontal,
  User,
  Settings,
  LifeBuoy,
  BarChart3,
  Bell,
  LogOut,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";

import { useSidebar } from "../context/SidebarContext";

const baseURL = import.meta.env.VITE_API_URL;

const navItems = [
  {
    icon: <LayoutDashboard size={18} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Users size={18} />,
    name: "User Management",
    path: "/users",
  },
  {
    icon: <UserCheck size={18} />,
    name: "Service Providers",
    path: "/vendors",
  },
  {
    icon: <Building2 size={18} />,
    name: "Property Management",
    subItems: [
      { name: "Property List", path: "/properties", pro: false },
      { name: "Setup Property", path: "/property-setup", pro: false },
    ],
  },
  {
    icon: <Wrench size={18} />,
    name: "Service Management",
    subItems: [
      { name: "Services List", path: "/service-management", pro: false },
      { name: "Services Setup", path: "/service-setup", pro: false },
    ],
  },
  {
    name: "Booking Management",
    icon: <CalendarDays size={18} />,
    subItems: [
      { name: "All Bookings", path: "/bookings", pro: false },
      { name: "Upcoming Bookings", path: "/bookings/upcoming", pro: false },
      { name: "Completed Bookings", path: "/bookings/completed", pro: false },
      { name: "Cancelled & Refund Requests", path: "/bookings/refunds", pro: false },
    ],
  },
  {
    icon: <Ticket size={18} />,
    name: "Coupon Management",
    path: "/coupanmange",
  },
  {
    icon: <Coins size={18} />,
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
    icon: <SlidersHorizontal size={18} />,
    name: "App Management",
    path: "/app-manage",
  },
  {
    icon: <UserCheck size={18} />,
    name: "Identity Management",
    path: "/identity-manage",
  }
];

const othersItems = [
  // {
  //   icon: <User size={18} />,
  //   name: "Profile",
  //   path: "/settings",
  // },
  {
    icon: <Settings size={18} />,
    name: "Account Settings",
    path: "/profile",
  },
  {
    icon: <LifeBuoy size={18} />,
    name: "Support",
    path: "/support",
  },
  {
    icon: <BarChart3 size={18} />,
    name: "Reports",
    path: "/reports",
  },
  {
    icon: <Bell size={18} />,
    name: "Notification",
    path: "/notifications",
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setIsLogoutModalOpen(false);
      navigate("/");
      setTimeout(() => {
        localStorage.removeItem("token");
        setUser(null);
      }, 50);
      toast.success("Logged out successfully!");
    }
  };

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

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
    return first + last || "A";
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
                  ? "menu-item-active text-brand-600 dark:text-white"
                  : "menu-item-inactive text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                {/* Active Submenu Left Indicator Bar */}
                {openSubmenu?.type === menuType && openSubmenu?.index === index && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-brand-500 dark:bg-brand-400" />
                )}
                <span
                  className={`menu-item-icon-size transition-colors duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-brand-500 dark:text-brand-400"
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    className={`ml-auto w-4 h-4 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500 dark:text-brand-400"
                      : "text-gray-400"
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
                  <ul className="mt-2 space-y-1 ml-9 border-l border-gray-200 dark:border-gray-850 pl-3">
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
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                {/* Active Link Left Indicator Bar */}
                {isActive(nav.path) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-brand-500 dark:bg-brand-400" />
                )}
                <span
                  className={`menu-item-icon-size transition-colors duration-200 ${isActive(nav.path)
                    ? "text-brand-500 dark:text-brand-400"
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
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

  const showFullInfo = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md dark:border-gray-800 text-gray-900 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200/50 
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
          {showFullInfo ? (
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
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-light.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {showFullInfo ? "Menu" : <MoreHorizontal className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {showFullInfo ? "Others" : <MoreHorizontal />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>

        {/* Superadmin Card Info at bottom */}
        <div className="mt-auto pb-6">
          {showFullInfo ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-150/40 dark:border-gray-800/40 transition-all duration-200">
              <span className="shrink-0 overflow-hidden rounded-xl h-9 w-9 border border-gray-200/50 dark:border-gray-800 bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                {user?.profileImage ? (
                  <img
                    src={`${baseURL}/uploads/adminProfileImage/${user.profileImage}`}
                    alt="Admin"
                    className="object-cover w-full h-full"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  getInitials(user?.firstName, user?.lastName)
                )}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-850 dark:text-white truncate max-w-[110px]">
                  {user?.firstName + " " + user?.lastName || "Admin User"}
                </p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                  Super Admin
                </p>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/15 rounded-xl transition-all active:scale-95 cursor-pointer border border-transparent hover:border-red-500/10 animate-pulse"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex justify-center cursor-pointer relative group"
            >
              <span className="overflow-hidden rounded-xl h-10 w-10 border border-gray-200/50 dark:border-gray-800 bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shadow-xs transition-transform duration-200 hover:scale-105">
                {user?.profileImage ? (
                  <img
                    src={`${baseURL}/uploads/adminProfileImage/${user.profileImage}`}
                    alt="Admin"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  getInitials(user?.firstName, user?.lastName)
                )}
              </span>
              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap uppercase tracking-widest border border-gray-800/20">
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};

export default AppSidebar;
