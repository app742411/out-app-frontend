import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useUser();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

    useEffect(() => {
        if (!user?._id) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(SOCKET_URL, {
            path: "/ws",
            transports: ["websocket"],
            auth: {
                token: localStorage.getItem("token")
            }
        });

        const playNotificationSound = () => {
            // Simple subtle beep sound (standard notification pattern)
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        };

        const showToast = (title) => {
            toast.success(title || "New Notification", {
                icon: '🔔',
                style: {
                    borderRadius: '20px',
                    background: '#172C53',
                    color: '#fff',
                    padding: '12px 24px',
                    fontWeight: 'bold',
                },
            });
            playNotificationSound();
        };

        newSocket.on("notification", (notification) => {
            // 🔔 show toast
            showToast(notification.title);
            
            // 🔢 update bell count
            incrementNotificationCount();
            
            // 📦 store in state
            setNotifications((prev) => [notification, ...prev]);
        });

        newSocket.on("receiveMessage", (message) => {
            if (window.location.pathname !== "/support") {
                playNotificationSound();
                toast(
                    (t) => (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0">
                                {message.senderName?.charAt(0) || "C"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{message.senderName || "New Message"}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{message.text || "Sent a message"}</p>
                            </div>
                        </div>
                    ),
                    { duration: 4000, position: 'bottom-right', style: { borderRadius: '16px' } }
                );
            }
        });

        newSocket.on("connect_error", (error) => {
            console.error("🔴 Socket CONNECTION ERROR:", error.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.off("notification");
            newSocket.off("receiveMessage");
            newSocket.disconnect();
        };
    }, [user?._id]);

    const incrementNotificationCount = () => setNotificationCount(prev => prev + 1);

    return (
        <SocketContext.Provider value={{
            socket,
            notifications,
            setNotifications,
            notificationCount,
            setNotificationCount,
            incrementNotificationCount
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
