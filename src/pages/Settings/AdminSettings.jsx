import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { getSystemSettings, updateSystemToggle } from "../../api/authApi";
import {
    Settings,
    ShieldCheck,
    Bell,
    HardDrive,
    Timer,
    Info,
    RefreshCcw,
    Globe,
    Mail,
    User,
    Lock,
    ChevronRight,
    Moon,
    Sun,
    Volume2
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const AdminSettings = () => {
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        notifications: true,
        platformName: "Out",
        adminEmail: "admin@outapp.com",
        version: "1.2.4",
        sessionExpiry: "24 Hours",
        lastBackup: "2024-03-12 10:30 PM"
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await getSystemSettings();
            if (res.data) setSettings(prev => ({ ...prev, ...res.data }));
        } catch (error) {
            console.warn("Using default settings (API not found)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleToggle = async (key, currentValue) => {
        const newValue = !currentValue;

        // Optimistic UI update
        setSettings(prev => ({ ...prev, [key]: newValue }));

        try {
            await updateSystemToggle(key, newValue);
            toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
        } catch (error) {
            toast.error("Failed to update setting");
            // Revert on failure
            setSettings(prev => ({ ...prev, [key]: currentValue }));
        }
    };

    const Toggle = ({ enabled, onChange, label, description, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">{label}</h4>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );

    const InfoItem = ({ label, value, icon: Icon }) => (
        <div className="flex items-center gap-4 p-4">
            <div className="text-gray-400">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</p>
            </div>
        </div>
    );

    return (
        <>
            <PageMeta title="Admin Settings - Out" />
            <PageBreadcrumb pageTitle="Platform Settings" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* General Information Card */}
                <div className="lg:col-span-3">
                    <ComponentCard title="Platform Overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
                            <InfoItem label="Site Name" value={settings.platformName} icon={Globe} />
                            <InfoItem label="Admin Email" value={settings.adminEmail} icon={Mail} />
                            <InfoItem label="Environment" value="Production" icon={ShieldCheck} />
                        </div>
                    </ComponentCard>
                </div>

                {/* System Toggles */}
                <div className="lg:col-span-2 space-y-6">
                    <ComponentCard title="System Controls">
                        <div className="space-y-4 pt-2">
                            <Toggle
                                label="Maintenance Mode"
                                description="Down the site for users while performing updates."
                                enabled={settings.maintenanceMode}
                                onChange={() => handleToggle('maintenanceMode', settings.maintenanceMode)}
                                icon={Settings}
                            />
                            <Toggle
                                label="Global Notifications"
                                description="Enable or disable push notifications across the platform."
                                enabled={settings.notifications}
                                onChange={() => handleToggle('notifications', settings.notifications)}
                                icon={Bell}
                            />
                            <Toggle
                                label="Dark Mode"
                                description="Toggle between light and dark theme interface."
                                enabled={theme === "dark"}
                                onChange={toggleTheme}
                                icon={theme === "dark" ? Moon : Sun}
                            />
                            <Toggle
                                label="System Sounds"
                                description="Enable audio feedback for alerts and actions."
                                enabled={settings.systemSounds || false}
                                onChange={() => handleToggle('systemSounds', settings.systemSounds)}
                                icon={Volume2}
                            />
                        </div>
                    </ComponentCard>
                </div>

                {/* System Info & Versioning */}
                <div className="lg:col-span-1 space-y-6">
                    <ComponentCard title="Release Info">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Info size={16} />
                                    <span className="text-sm">App Version</span>
                                </div>
                                <span className="text-sm font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded">
                                    v{settings.version}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Timer size={16} />
                                    <span className="text-sm">Session Timeout</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {settings.sessionExpiry}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <RefreshCcw size={16} />
                                    <span className="text-sm">Last Backup</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500">
                                    {settings.lastBackup}
                                </span>
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                {/* Account Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <ComponentCard title="Account Security">
                        <div className="space-y-3 pt-2">
                            <Link
                                to="/profile"
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.03] rounded-lg border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm text-gray-500 group-hover:text-brand-500">
                                        <User size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Profile</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            <Link
                                to="/change-password"
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.03] rounded-lg border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm text-gray-500 group-hover:text-brand-500">
                                        <Lock size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </ComponentCard>
                </div>

            </div>
        </>
    );
};

export default AdminSettings;
