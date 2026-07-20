import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext.jsx";
import { logout } from "../../api/authApi";
import { LogOut } from "lucide-react";
import LogoutModal from "../common/LogoutModal";

const baseURL = import.meta.env.VITE_API_URL;

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setIsOpen(false);
      setIsLogoutModalOpen(false);
      navigate("/");
      setTimeout(() => {
        localStorage.removeItem("token");
        setUser(null);
      }, 50);
      toast.success("Logged out successfully!");
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400 focus:outline-hidden"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 shadow-sm border border-gray-200/50 dark:border-gray-800">
          <img
            src={
              user?.profileImage
                ? `${baseURL}/uploads/adminProfileImage/${user.profileImage}`
                : "/images/user/owner.jpg"
            }
            alt={user?.fullName || "Admin"}
            className="object-cover w-full h-full"
          />
        </span>
        <span className="block mr-1 font-medium text-theme-sm text-gray-800 dark:text-white/90">
          {user?.firstName + " " + user?.lastName || "Admin User"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-500" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-1.5 flex w-[240px] flex-col rounded-2xl border border-gray-200/80 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark before:content-[''] before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-2.5 before:bg-transparent"
      >
        {/* User Account Info Header */}
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="block font-semibold text-gray-850 text-sm dark:text-white/90">
            {user?.firstName + " " + user?.lastName || "Admin User"}
          </span>
          <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500 truncate">
            {user?.email || "admin@example.com"}
          </span>
        </div>

        {/* Navigation Dropdown List */}
        <ul className="flex flex-col gap-0.5 py-2 border-b border-gray-100 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-600 rounded-lg group text-theme-sm hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-250 transition-colors duration-150"
            >
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/change-password"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-600 rounded-lg group text-theme-sm hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-250 transition-colors duration-150"
            >
              Change password
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/account"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-600 rounded-lg group text-theme-sm hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-250 transition-colors duration-150"
            >
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/support"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-600 rounded-lg group text-theme-sm hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-250 transition-colors duration-150"
            >
              Support
            </DropdownItem>
          </li>
        </ul>

        {/* Log Out */}
        <button
          onClick={() => {
            setIsOpen(false);
            setIsLogoutModalOpen(true);
          }}
          className="flex items-center gap-3 w-full px-3 py-2 mt-2 font-medium text-red-500 rounded-lg text-theme-sm hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10 transition-colors duration-150 cursor-pointer"
        >
          <LogOut className="size-4" />
          Log Out
        </button>
      </Dropdown>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
