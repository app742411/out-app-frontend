import React, { useEffect, useState } from "react";
import { getAdminConversations } from "../../api/authApi";
import { useUser } from "../../context/UserContext";
import ChatInterface from "./ChatInterface";
import { useQuery } from "@tanstack/react-query";

export default function SupportListComp({ chatType }) {
    const [selectedConv, setSelectedConv] = useState(null);
    const [page, setPage] = useState(1);

    const { user: currentUser } = useUser();

    useEffect(() => {
        setPage(1);
    }, [chatType]);

    const { data: queryData, isLoading: loading, error: queryError } = useQuery({
        queryKey: ["adminConversations", chatType, page],
        queryFn: () => getAdminConversations(chatType, page),
        enabled: !!currentUser?._id
    });

    const conversations = queryData?.success ? (queryData.data || []) : [];
    const totalPages = queryData?.success ? (queryData.totalPages || 1) : 1;
    const error = queryError ? "Failed to fetch conversations" : null;

    const filteredConversations = conversations.filter(conv => {
        if (chatType === "USER_SUPPORT") return !!conv.userId;
        if (chatType === "SERVICE_SUPPORT") return !!conv.serviceUserId;
        return true;
    });

    if (selectedConv) {
        return (
            <div className="flex gap-6 h-[75vh] min-h-[600px] animate-in fade-in duration-500">
                {/* Left side: Slim list (Hidden on small screens) */}
                <div className="w-80 hidden lg:flex flex-col bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl shadow-brand/5 border border-gray-50 dark:border-gray-800 overflow-hidden shrink-0">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Conversations</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{filteredConversations.length} Active Threads</p>
                    </div>
                    <div className="flex-1 overflow-y-auto w-full p-2 space-y-1">
                        {filteredConversations.map(conv => {
                            const user = conv.userId || conv.serviceUserId;
                            const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown User";
                            const isSelected = selectedConv._id === conv._id;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedConv(conv)}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 relative group border ${isSelected ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-white/5 border-transparent hover:border-gray-100 dark:hover:border-gray-800'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-11 h-11 rounded-xl overflow-hidden shadow-sm border-2 ${isSelected ? 'border-white/30' : 'border-gray-50 dark:border-gray-800'}`}>
                                            <img
                                                src={user?.profile || user?.profileImage ? `${import.meta.env.VITE_API_URL || "http://localhost:8088"}/uploads/users/${user.profile || user.profileImage}` : `https://ui-avatars.com/api/?name=${userName}&background=random`}
                                                alt={userName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/images/user/user-01.jpg"; }}
                                            />
                                        </div>
                                        {conv.adminUnreadCount > 0 && !isSelected && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg animate-bounce"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className={`font-bold text-xs truncate ${isSelected ? 'text-indigo-950' : 'text-gray-900 dark:text-gray-100'}`}>{userName}</span>
                                            {isSelected && <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500">Active</span>}
                                        </div>
                                        <p className={`text-[10px] truncate w-full font-medium ${isSelected ? 'text-indigo-900/60' : 'text-gray-400'}`}>
                                            {conv.lastMessage || "Original support query"}
                                        </p>
                                    </div>
                                    {!isSelected && (
                                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* Right side: Chat */}
                <div className="flex-1 h-full max-w-full lg:max-w-[calc(100%-20rem-1.5rem)]">
                    <ChatInterface conversation={selectedConv} onClose={() => setSelectedConv(null)} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Last Message</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4 text-center">Priority</th>
                            <th className="px-6 py-4 text-center">Unread</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10">
                                    <div className="animate-spin h-6 w-6 border-2 border-brand border-t-transparent rounded-full mx-auto"></div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredConversations.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No conversations found.
                                </td>
                            </tr>
                        ) : (
                            filteredConversations.map((conv) => {
                                const user = conv.userId || conv.serviceUserId;
                                const userName = user ? `${user.firstName || ""} ${user.lastName || ""}` : "Unknown";
                                const userEmail = user?.email || "";
                                const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8088";
                                const userImage = (user?.profile || user?.profileImage)
                                    ? `${SOCKET_URL}/uploads/users/${user.profile || user.profileImage}`
                                    : null;

                                return (
                                    <tr key={conv._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {userImage ? (
                                                    <img
                                                        src={userImage}
                                                        alt={userName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/user/user-01.jpg"; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                                                        {user?.firstName?.charAt(0) || "U"}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {userName.trim()}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {userEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {conv.ticket?.subject || "No Subject"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                                {conv.lastMessage || "No messages"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleString() : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${conv.ticket?.priority === "HIGH"
                                                ? "bg-red-50 text-red-600 border border-red-100"
                                                : conv.ticket?.priority === "MEDIUM"
                                                    ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                                                    : "bg-blue-50 text-blue-600 border border-blue-100"
                                                }`}>
                                                {conv.ticket?.priority || "NORMAL"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {(conv.adminUnreadCount || 0) > 0 ? (
                                                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                                                    {conv.adminUnreadCount}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${conv.ticket?.status === "CLOSED"
                                                    ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                    : conv.ticket?.status === "IN_PROGRESS"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500"
                                                    }`}
                                            >
                                                {conv.ticket?.status ? conv.ticket.status.replace("_", " ") : (conv.isClosed ? "Closed" : "Active")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedConv(conv)}
                                                className="text-gray-500 hover:text-brand transition-colors p-1"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!selectedConv && totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.03] border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors dark:text-gray-200"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors dark:text-gray-200"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
