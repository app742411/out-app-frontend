import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { useSocket } from "../../context/SocketContext";
import { getAdminNotifications, adminDeleteNotifications } from "../../api/authApi";
import toast from "react-hot-toast";
import NotificationDetailsModal from "../Notifications/NotificationDetailsModal";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, setNotifications, notificationCount, setNotificationCount } = useSocket();
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await getAdminNotifications();
        if (res?.data) {
          setNotifications(res.data);
          const unreadCount = res.data.filter(n => !n.isRead).length;
          setNotificationCount(unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNotificationCount(0);
    }
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleNotificationClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
    closeDropdown();
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    try {
      const ids = notifications.map(n => n._id);
      await adminDeleteNotifications(ids);
      setNotifications([]);
      setNotificationCount(0);
      toast.success("Notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {notificationCount > 0 && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
            <span className="absolute inline-flex w-full h-full bg-orange-500 rounded-full opacity-75 animate-ping"></span>
            <span className="relative">{notificationCount > 99 ? '99+' : notificationCount}</span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications ({notifications.length})
          </h5>
          <button
            onClick={handleDeleteAll}
            className="text-xs font-medium text-brand hover:underline"
          >
            Clear All
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <svg className="w-12 h-12 opacity-20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <p className="text-sm font-medium">All caught up!</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <li key={notification._id || index}>
                <button
                  onClick={() => handleNotificationClick(notification._id)}
                  className="w-full text-left flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4.5 py-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-all duration-200"
                >
                  <span className={`relative block w-full h-10 rounded-full z-1 max-w-10 min-w-10 flex items-center justify-center shadow-lg ${notification.type === "BOOKING" ? "bg-blue-500" :
                      notification.type === "PAYMENT" ? "bg-green-500" :
                        notification.type === "REFUND" ? "bg-red-500" :
                          notification.type === "CHAT" ? "bg-indigo-500" : "bg-brand"
                    }`}>
                    {notification.type === "BOOKING" ? "📅" : notification.type === "PAYMENT" ? "💰" : notification.type === "CHAT" ? "💬" : "🔔"}
                    {!notification.isRead && <span className="absolute top-0 right-0 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>}
                  </span>

                  <span className="block overflow-hidden flex-1">
                    <span className="mb-0.5 block text-theme-sm font-bold text-gray-800 dark:text-white truncate">
                      {notification.title}
                    </span>
                    <span className="mb-1.5 text-[11px] block text-gray-500 dark:text-gray-400 line-clamp-1 italic">
                      {notification.body || notification.message}
                    </span>

                    <span className="flex items-center gap-2 text-gray-400 text-[9px] dark:text-gray-500 uppercase font-black tracking-widest">
                      <span>{notification.type}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{formatTime(notification.createdAt)}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <Link
          to="/notifications"
          className="block px-4 py-3 mt-3 text-xs font-black uppercase tracking-widest text-center text-white bg-brand rounded-2xl hover:shadow-2xl hover:shadow-brand/20 transition-all active:scale-95 duration-200"
          onClick={closeDropdown}
        >
          View All Center
        </Link>
      </Dropdown>

      {/* Details Modal */}
      <NotificationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notificationId={selectedId}
      />
    </div>
  );
}
