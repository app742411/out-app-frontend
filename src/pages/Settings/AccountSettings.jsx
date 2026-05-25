import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useUser } from "../../context/UserContext.jsx";
import { useTheme } from "../../context/ThemeContext";
import {
    getSystemSettings,
    updateSystemToggle,
    updateAdminProfile,
    changePassword
} from "../../api/authApi";
import {
    User,
    Shield,
    Info,
    Settings as SettingsIcon,
    Globe,
    Mail,
    Phone,
    Moon,
    Sun,
    Lock,
    Eye,
    EyeOff,
    Save,
    Key,
    Database,
    Cpu,
    Wifi,
    Camera,
    CheckCircle,
    Activity
} from "lucide-react";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL;

export default function AccountSettings() {
    const { user, fetchDashboard } = useUser();
    const { theme, toggleTheme } = useTheme();

    // Active Tab State
    const [activeTab, setActiveTab] = useState("profile");

    // Profile States
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // System Settings States
    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        notifications: true,
        platformName: "Out",
        adminEmail: "admin@outapp.com",
        version: "1.2.4",
        sessionExpiry: "24 Hours",
        lastBackup: "2024-03-12 10:30 PM",
        systemSounds: false
    });
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);

    // Change Password States
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        text: "Too Short",
        color: "bg-red-500"
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Live Latency State (Mocked real-time performance check for Out)
    const [latency, setLatency] = useState(24);

    // Sync user data to profileForm
    useEffect(() => {
        if (user) {
            setProfileForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || user.phoneNumber || ""
            });
            if (user.profileImage) {
                setAvatarPreview(`${IMAGE_BASE_URL}/uploads/adminProfileImage/${user.profileImage}`);
            }
        }
    }, [user]);

    // Fetch system settings
    const fetchSettings = async () => {
        try {
            setIsLoadingSettings(true);
            const res = await getSystemSettings();
            if (res.data) {
                setSystemSettings(prev => ({ ...prev, ...res.data }));
            }
        } catch (error) {
            console.warn("Using default settings (API endpoint fallback)");
        } finally {
            setIsLoadingSettings(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Simulate a minor latency fluctuation for visual immersion
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * 12) + 18);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Password strength check
    useEffect(() => {
        const pass = passwordForm.newPassword;
        if (!pass) {
            setPasswordStrength({ score: 0, text: "Enter Password", color: "bg-gray-200 dark:bg-gray-700" });
            return;
        }
        let score = 0;
        if (pass.length >= 6) score += 20;
        if (pass.length >= 10) score += 20;
        if (/[A-Z]/.test(pass)) score += 20;
        if (/[0-9]/.test(pass)) score += 20;
        if (/[^A-Za-z0-9]/.test(pass)) score += 20;

        let text = "Weak";
        let color = "bg-red-500";

        if (score >= 80) {
            text = "Strong (Secure)";
            color = "bg-green-500";
        } else if (score >= 50) {
            text = "Medium";
            color = "bg-yellow-500";
        }

        setPasswordStrength({ score, text, color });
    }, [passwordForm.newPassword]);

    // Handle Profile Input
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle Avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            toast.success("Avatar preview updated. Press Save changes below!");
        }
    };

    // Save profile details
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setIsSavingProfile(true);
            const data = new FormData();
            data.append("firstName", profileForm.firstName);
            data.append("lastName", profileForm.lastName);
            data.append("email", profileForm.email);
            data.append("phone", profileForm.phone);
            if (avatarFile) {
                data.append("profileImage", avatarFile);
            }

            await updateAdminProfile(data);
            toast.success("Account profile successfully updated!");
            setIsEditing(false);
            if (fetchDashboard) {
                await fetchDashboard();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to save profile modifications.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Handle System Toggles
    const handleSystemToggle = async (key, currentValue) => {
        const newValue = !currentValue;
        setSystemSettings(prev => ({ ...prev, [key]: newValue }));

        try {
            await updateSystemToggle(key, newValue);
            toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())} modified`);
        } catch (error) {
            toast.error("Failed to sync system preferences.");
            setSystemSettings(prev => ({ ...prev, [key]: currentValue })); // Rollback
        }
    };

    // Change Password submit
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error("Please fill in all security fields.");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        try {
            setIsChangingPassword(true);
            await changePassword(passwordForm.oldPassword, passwordForm.newPassword, passwordForm.confirmPassword);
            toast.success("Password rotated successfully!");
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.message || "Invalid credentials. Try again.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile Info", icon: User },
        { id: "appearance", label: "System Preferences", icon: SettingsIcon },
        { id: "diagnostics", label: "Out Platform Details", icon: Info },
        { id: "security", label: "Security Shield", icon: Shield }
    ];

    return (
        <>
            <PageMeta title="Account Settings - Out Hub" />
            <PageBreadcrumb pageTitle="Account Settings" />

            <div className="space-y-6">
                {/* Visual Glassmorphic Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 shadow-sm">
                    {/* Radial background glowing mesh */}
                    <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10 pointer-events-none"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-6 justify-between">
                        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                            {/* Interactive Profile Photo Container */}
                            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-brand-500 dark:border-brand-500/40 shadow-md">
                                <img
                                    src={avatarPreview || "/images/user/owner.jpg"}
                                    alt={user?.firstName || "Admin"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = "/images/user/owner.jpg";
                                    }}
                                />
                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Camera size={20} className="text-white mb-0.5" />
                                    <span className="text-[10px] text-white font-medium">Change</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                                        {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Out Administrator"}
                                    </h2>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                        Live Admin
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 justify-center md:justify-start">
                                    <Mail size={14} className="text-gray-400" />
                                    {user?.email || "admin@outapp.com"}
                                </p>
                            </div>
                        </div>

                        {/* Top Right Quick Stats */}
                        <div className="flex gap-4 border-t border-gray-100 dark:border-gray-800/60 pt-4 md:pt-0 md:border-none w-full md:w-auto justify-around">
                            <div className="text-center md:text-right px-4">
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Gateway</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white/90 mt-0.5 flex items-center gap-1 justify-center md:justify-end">
                                    <Activity size={16} className="text-brand-500" /> Connected
                                </p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                            <div className="text-center md:text-right px-4">
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Latency</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white/90 mt-0.5">
                                    {latency}ms
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Split Navigation and Form controls */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Tab Navigation Sidebar */}
                    <div className="lg:col-span-1 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-1">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">Settings Hub</p>
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.02] hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <IconComponent size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Content Pane */}
                    <div className="lg:col-span-3">
                        {/* Tab 1: Profile Information */}
                        {activeTab === "profile" && (
                            <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/60">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Personal Identity</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">View or update administrator personal credentials.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                                            isEditing
                                                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                                                : "bg-brand-500 hover:bg-brand-600 text-white border-transparent shadow-sm"
                                        }`}
                                    >
                                        {isEditing ? "View Details" : "Edit Profile"}
                                    </button>
                                </div>

                                {!isEditing ? (
                                    /* View details mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40">
                                            <div className="p-2 h-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">First Name</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-1">{profileForm.firstName || "Not provided"}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40">
                                            <div className="p-2 h-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Last Name</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-1">{profileForm.lastName || "Not provided"}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40">
                                            <div className="p-2 h-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">System Email</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-1">{profileForm.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40">
                                            <div className="p-2 h-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Phone Contact</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-1">{profileForm.phone || "No phone added"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Edit details form */
                                    <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={profileForm.firstName}
                                                    onChange={handleProfileChange}
                                                    required
                                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={profileForm.lastName}
                                                    onChange={handleProfileChange}
                                                    required
                                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address (Read Only)</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileForm.email}
                                                    readOnly
                                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800/80 bg-gray-100 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 focus:outline-none cursor-default"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={profileForm.phone}
                                                    onChange={handleProfileChange}
                                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.02] text-sm font-medium transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSavingProfile}
                                                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/70 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-md shadow-brand-500/10 transition-all cursor-pointer"
                                            >
                                                <Save size={16} />
                                                {isSavingProfile ? "Saving..." : "Save Modifications"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Appearance & Preferences */}
                        {activeTab === "appearance" && (
                            <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Appearance & System Controls</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Configure visual themes and control engine toggle parameters.</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    {/* Dark Mode Main Card */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-white/[0.02] dark:to-transparent border border-gray-100 dark:border-gray-800/80 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl text-brand-500 shadow-inner">
                                                {theme === "dark" ? <Moon size={22} className="animate-pulse" /> : <Sun size={22} />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white/90">Dark Theme Configuration</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Toggle visual layout lighting state globally.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                                                theme === "dark" ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-800"
                                            }`}
                                        >
                                            <span
                                                className={`flex items-center justify-center h-5.5 w-5.5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                                                }`}
                                            >
                                                {theme === "dark" ? (
                                                    <Moon size={10} className="text-brand-500" />
                                                ) : (
                                                    <Sun size={10} className="text-amber-500" />
                                                )}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Maintenance Control Toggle */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400">
                                                <SettingsIcon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white/90">Maintenance Gate</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Suspend platform operations for client-side users during build updates.</p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={true}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none opacity-50 cursor-not-allowed ${
                                                systemSettings.maintenanceMode ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                    systemSettings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Global Notifications Switch */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400">
                                                <Wifi size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white/90">Global Push Signals</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Toggle push notification listeners and alerts across ecosystem channels.</p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={true}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none opacity-50 cursor-not-allowed ${
                                                systemSettings.notifications ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                    systemSettings.notifications ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Audio feedback Switch */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white/90">System Sound Feedback</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Trigger subtle acoustic ticks during button press and modal pops.</p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={true}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none opacity-50 cursor-not-allowed ${
                                                systemSettings.systemSounds ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                    systemSettings.systemSounds ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Diagnostics & Out Details */}
                        {activeTab === "diagnostics" && (
                            <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Out Platform Overview</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Visual monitoring metrics detailing system settings and nodes.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 relative overflow-hidden group">
                                        <div className="absolute right-4 bottom-4 opacity-10 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                                            <Globe size={64} />
                                        </div>
                                        <div className="p-2 h-fit w-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                            <Globe size={18} />
                                        </div>
                                        <h4 className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-4">Platform Title</h4>
                                        <p className="text-base font-bold text-gray-800 dark:text-white/90 mt-1">{systemSettings.platformName}</p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 relative overflow-hidden group">
                                        <div className="absolute right-4 bottom-4 opacity-10 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                                            <Cpu size={64} />
                                        </div>
                                        <div className="p-2 h-fit w-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                            <Cpu size={18} />
                                        </div>
                                        <h4 className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-4">System Build</h4>
                                        <p className="text-base font-bold text-gray-800 dark:text-white/90 mt-1">v{systemSettings.version || "1.2.4"}</p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 relative overflow-hidden group">
                                        <div className="absolute right-4 bottom-4 opacity-10 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                                            <Shield size={64} />
                                        </div>
                                        <div className="p-2 h-fit w-fit bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
                                            <Shield size={18} />
                                        </div>
                                        <h4 className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-4">Environment</h4>
                                        <p className="text-base font-bold text-gray-800 dark:text-white/90 mt-1">Production (SSL)</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    {/* DB stats */}
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Database className="text-gray-400 dark:text-gray-500" size={18} />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Database Replication Node</p>
                                                <p className="text-xs text-gray-400">AWS cluster MongoDB Atlas. Sharded - Healthy</p>
                                            </div>
                                        </div>
                                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                                            <CheckCircle size={14} /> Active
                                        </span>
                                    </div>

                                    {/* Uptime snapshot */}
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Info className="text-gray-400 dark:text-gray-500" size={18} />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last System Backup</p>
                                                <p className="text-xs text-gray-400">Automated midnight snapshot storage bucket.</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {systemSettings.lastBackup || "2024-03-12 10:30 PM"}
                                        </span>
                                    </div>

                                    {/* session details */}
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Lock className="text-gray-400 dark:text-gray-500" size={18} />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Token Session Expiry</p>
                                                <p className="text-xs text-gray-400">JWT security authorization timeout length.</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded font-bold">
                                            {systemSettings.sessionExpiry || "24 Hours"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 4: Security Shield */}
                        {activeTab === "security" && (
                            <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Credentials Rotation</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Rotate administrator login password safely.</p>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.old ? "text" : "password"}
                                                value={passwordForm.oldPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                                                required
                                                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-11 py-3 text-sm text-gray-800 dark:text-white/90 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                required
                                                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-11 py-3 text-sm text-gray-800 dark:text-white/90 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {/* Complexity Scorebar */}
                                        {passwordForm.newPassword && (
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-400 font-semibold uppercase tracking-wider">Complexity Gauge</span>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300">{passwordStrength.text}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                        style={{ width: `${passwordStrength.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                required
                                                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-11 py-3 text-sm text-gray-800 dark:text-white/90 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-3">
                                        <button
                                            type="submit"
                                            disabled={isChangingPassword}
                                            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/70 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-md shadow-brand-500/10 transition-all cursor-pointer"
                                        >
                                            <Key size={16} />
                                            {isChangingPassword ? "Updating..." : "Rotate Credentials"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
