import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getMessages, closeTicket, reopenTicket, sendChatMessage } from "../../api/authApi";
import { useUser } from "../../context/UserContext";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";

export default function ChatInterface({ conversation, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [typingUser, setTypingUser] = useState(false);
    const [isUserOnline, setIsUserOnline] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [lightboxMedia, setLightboxMedia] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const { user: currentUser } = useUser();
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const queryClient = useQueryClient();
    const chatContainerRef = useRef(null);
    const scrollHeightRef = useRef(0);

    const adminId = currentUser?._id;
    const conversationId = conversation?._id;
    const otherUser = conversation?.userId || conversation?.serviceUserId;
    const otherUserId = otherUser?._id;
    const otherUserName = otherUser ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || otherUser.email : "User Support";
    const Base_URL = import.meta.env.VITE_API_URL;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const lastMessageId = useRef(null);

    useEffect(() => {
        if (messages.length > 0) {
            const currentLastMessage = messages[messages.length - 1]._id;
            if (lastMessageId.current !== currentLastMessage || messages.length <= 20) {
                scrollToBottom();
                lastMessageId.current = currentLastMessage;
            }
        }
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [typingUser]);

    useEffect(() => {
        if (!adminId) return;
        const socket = io(SOCKET_URL, {
            path: "/ws",
            transports: ["websocket"],
            auth: {
                token: localStorage.getItem("token")
            }
        });
        console.log("Socket instance initialized:", socket);
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("🟢 Socket CONNECTED to everything. ID:", socket.id);
            socket.emit("registerUser", adminId);
            if (conversationId) {
                console.log("📖 Socket EMITTING markAsRead:", { conversationId, userId: adminId });
                socket.emit("markAsRead", { conversationId, userId: adminId });
            }
        });

        socket.on("connect_error", (error) => {
            console.error("🔴 Socket CONNECTION ERROR:", error.message);
        });

        socket.on("disconnect", (reason) => {
            console.warn("🟡 Socket DISCONNECTED. Reason:", reason);
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log("⏳ Socket RECONNECTING... attempt:", attempt);
        });

        socket.on("reconnect", (attempt) => {
            console.log("🟢 Socket RECONNECTED. Total attempts:", attempt);
        });

        socket.on("receiveMessage", (msg) => {
            console.log("📩 Socket RECEIVED Message:", msg);
            if (msg.conversationId === conversationId) setMessages((prev) => [...prev, msg]);
        });

        socket.on("userTyping", ({ senderId }) => {
            if (senderId?.toString() !== adminId?.toString()) setTypingUser(true);
        });

        socket.on("userStopTyping", ({ senderId }) => {
            if (senderId?.toString() !== adminId?.toString()) setTypingUser(false);
        });

        socket.on("userOnline", (id) => {
            console.log("👤 Socket: userOnline - ID:", id);
            if (id?.toString() === otherUserId?.toString()) setIsUserOnline(true);
        });

        socket.on("userOffline", (id) => {
            console.log("👤 Socket: userOffline - ID:", id);
            if (id?.toString() === otherUserId?.toString()) setIsUserOnline(false);
        });

        socket.on("onlineStatusResult", (data) => {
            console.log("👤 Socket: onlineStatusResult - Data:", data);
            if (data.userId?.toString() === otherUserId?.toString()) setIsUserOnline(data.isOnline);
        });

        socket.on("errorMessage", (msg) => {
            console.error("💥 Socket ERROR message:", msg);
            toast.error(msg)
        });

        return () => socket.disconnect();
    }, [adminId, conversationId]);

    useEffect(() => {
        if (!conversationId || !socketRef.current) return;
        console.log("🤝 Socket EMITTING joinConversation:", conversationId);
        socketRef.current.emit("joinConversation", conversationId);
        console.log("📖 Socket EMITTING markAsRead:", { conversationId, userId: adminId });
        socketRef.current.emit("markAsRead", { conversationId, userId: adminId });
        setTimeout(() => {
            console.log("🤝 Socket EMITTING checkOnlineStatus:", otherUserId);
            socketRef.current.emit("checkOnlineStatus", otherUserId);
        }, 200);
    }, [conversationId]);

    const {
        data: messagesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isMessagesLoading
    } = useInfiniteQuery({
        queryKey: ["messages", conversationId],
        queryFn: ({ pageParam = null }) => getMessages(conversationId, pageParam),
        getNextPageParam: (lastPage) => lastPage.pagination?.hasMore ? lastPage.pagination.nextCursor : undefined,
        enabled: !!conversationId
    });

    useEffect(() => {
        if (messagesData?.pages) {
            const allMessages = [...messagesData.pages].reverse().flatMap(page => page.data);
            setMessages(allMessages);
            
            if (scrollHeightRef.current > 0 && chatContainerRef.current) {
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        const newScrollHeight = chatContainerRef.current.scrollHeight;
                        chatContainerRef.current.scrollTop = newScrollHeight - scrollHeightRef.current;
                        scrollHeightRef.current = 0;
                    }
                }, 0);
            }

            const firstPage = messagesData.pages[0];
            if (firstPage?.ticket) {
                setTicket(firstPage.ticket || conversation.ticket);
            }
        }
        setLoading(isMessagesLoading);
    }, [messagesData, isMessagesLoading, conversation]);

    const handleScroll = (e) => {
        if (e.target.scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
            scrollHeightRef.current = e.target.scrollHeight;
            fetchNextPage();
        }
    };

    const sendMessageMutation = useMutation({
        mutationFn: sendChatMessage,
        onSuccess: () => {
            if (ticket?.status === "OPEN") {
                setTicket(prev => ({ ...prev, status: "IN_PROGRESS" }));
            }
            queryClient.invalidateQueries(["messages", conversationId]);
        },
        onError: (error) => {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message");
        }
    });

    const closeTicketMutation = useMutation({
        mutationFn: closeTicket,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Ticket closed");
                setTicket(prev => ({ ...prev, status: "CLOSED" }));
            }
        },
        onError: (err) => toast.error(err?.message || "Failed to close ticket")
    });

    const reopenTicketMutation = useMutation({
        mutationFn: reopenTicket,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Ticket reopened");
                setTicket(prev => ({ ...prev, status: "IN_PROGRESS" }));
            }
        },
        onError: (err) => toast.error(err?.message || "Failed to reopen ticket")
    });

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        const text = newMessage.trim();
        if (!text && attachments.length === 0) return;

        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const tempAttachments = attachments.map(file => ({
            url: URL.createObjectURL(file),
            fileName: file.name,
            originalName: file.name,
            mimeType: file.type,
            isTemp: true
        }));

        const tempMessage = {
            _id: tempId,
            conversationId,
            senderId: adminId,
            message: text,
            attachments: tempAttachments,
            createdAt: new Date().toISOString(),
            isSending: true,
            sender: currentUser
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage("");
        setAttachments([]);

        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("senderId", adminId);
        formData.append("message", text);

        attachments.forEach((file) => {
            const type = file.type;
            if (type.startsWith("image/")) formData.append("chatImage", file);
            else if (type.startsWith("video/")) formData.append("chatVideo", file);
            else if (type.startsWith("audio/")) formData.append("chatAudio", file);
            else formData.append("chatDocument", file);
        });

        sendMessageMutation.mutate(formData);

        if (socketRef.current && socketRef.current.connected) {
            console.log("📤 Socket EMITTING sendMessage via socket because it is connected.");
            socketRef.current.emit("sendMessage", { conversationId, senderId: adminId, message: text });
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioFile = new File([audioBlob], `voice_message_${Date.now()}.mp3`, { type: 'audio/mp3' });
                setAttachments(prev => [...prev, audioFile]);
                audioChunksRef.current = []; // Reset
            };
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.error("Microphone access denied");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleTyping = () => {
        console.log("📤 Socket EMITTING typing...");
        socketRef.current.emit("typing", { conversationId, senderId: adminId });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (socketRef.current) {
                console.log("📤 Socket EMITTING stopTyping...");
                socketRef.current.emit("stopTyping", { conversationId, senderId: adminId });
            }
        }, 1000);
    };

    const handleCloseTicket = () => {
        if (!ticket?._id) return;
        closeTicketMutation.mutate(ticket._id);
    };

    const handleReopenTicket = () => {
        if (!ticket?._id) return;
        reopenTicketMutation.mutate(ticket._id);
    };

    return (
        <div className="flex h-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-brand/5 overflow-hidden">
            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-gray-50 dark:ring-gray-800 group-hover:ring-brand/30 transition-all duration-300 shadow-sm">
                                <img
                                    src={otherUser?.profile || otherUser?.profileImage 
                                        ? `${Base_URL}/uploads/${otherUser?.senderType === "Admin" ? "adminProfileImage" : "users"}/${otherUser.profile || otherUser.profileImage}` 
                                        : "/images/user/user-01.jpg"}
                                    className="w-full h-full object-cover"
                                    alt="avatar"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/user/user-01.jpg"; }}
                                />
                            </div>
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-sm transition-colors ${isUserOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] leading-tight">
                                {otherUserName}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                {typingUser ? (
                                    <span className="text-[10px] text-brand font-bold animate-pulse tracking-wide uppercase">Typing...</span>
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{isUserOnline ? 'Online Now' : 'Currently Offline'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {ticket && (
                            <button
                                onClick={ticket.status === "CLOSED" ? handleReopenTicket : handleCloseTicket}
                                className={`hidden md:flex px-4 py-2 rounded-xl text-xs font-bold transition-all items-center gap-2 ${ticket.status === "CLOSED"
                                    ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
                                    : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                                    }`}
                            >
                                {ticket.status === "CLOSED" ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>}
                                {ticket.status === "CLOSED" ? "Reopen" : "Close Ticket"}
                            </button>
                        )}
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className={`p-2.5 rounded-xl transition-all ${showInfo ? 'bg-brand/10 text-brand' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            title="Conversation Info"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 mx-1"></div>
                        <button onClick={onClose} className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* MESSAGES */}
                <div 
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20 dark:bg-transparent scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
                >
                    {isFetchingNextPage && (
                        <div className="flex justify-center py-2">
                            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    {loading && messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center opacity-60">
                            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-3"></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hydrating History</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-inner flex items-center justify-center border border-gray-50 dark:border-gray-800">
                                <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-300">Clean Slate</p>
                                <p className="text-[10px] text-gray-400 uppercase leading-relaxed mt-1 tracking-widest">No messages in this thread yet</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isMe = msg.sender?.senderType === "Admin" || msg.senderId?.toString() === adminId?.toString();
                            const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;

                            return (
                                <div key={msg._id || i} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse animate-in slide-in-from-right-4' : 'flex-row animate-in slide-in-from-left-4'} duration-300`}>
                                    <div className={`w-8 h-8 shrink-0 rounded-xl overflow-hidden shadow-sm border-2 border-white dark:border-gray-800 transition-opacity ${!showAvatar && 'opacity-0'}`}>
                                        <img
                                            src={msg.sender?.profile || msg.sender?.profileImage 
                                                ? `${Base_URL}/uploads/${msg.sender?.senderType === "Admin" ? "adminProfileImage" : "users"}/${msg.sender.profile || msg.sender.profileImage}` 
                                                : `https://ui-avatars.com/api/?name=${msg.sender?.firstName || "User"}&background=${isMe ? '000' : 'random'}&color=fff`}
                                            className="w-full h-full object-cover"
                                            alt="avatar"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "/images/user/user-01.jpg"; }}
                                        />
                                    </div>
                                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-4 py-2.5 pb-6 text-sm transition-all relative shadow-sm flex flex-col gap-2 ${isMe
                                            ? 'bg-indigo-50 text-indigo-900 border border-indigo-100/50 rounded-2xl rounded-br-md'
                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md border border-gray-100 dark:border-gray-800 shadow-sm'
                                            }`}>

                                            {/* Render Media */}
                                            {msg.attachments?.filter(a => a.mimeType?.startsWith('image/')).length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.attachments.filter(a => a.mimeType?.startsWith('image/')).map((img, idx) => (
                                                        <div key={idx} className="relative group cursor-pointer" onClick={() => setLightboxMedia({ type: 'image', url: img.isTemp ? img.url : `${Base_URL}/${img.url || `uploads/chatImage/${img.fileName}`}` })}>
                                                            <img src={img.isTemp ? img.url : `${Base_URL}/${img.url || `uploads/chatImage/${img.fileName}`}`} className={`w-32 h-32 object-cover rounded-xl border border-black/10 shadow-sm transition-all ${msg.isSending ? 'opacity-60 blur-[2px]' : 'group-hover:opacity-90'}`} alt="attachment" />
                                                            {msg.isSending && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin shadow-sm"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {msg.attachments?.filter(a => a.mimeType?.startsWith('video/')).length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    {msg.attachments.filter(a => a.mimeType?.startsWith('video/')).map((vid, idx) => (
                                                        <div key={idx} className="relative group cursor-pointer" onClick={() => setLightboxMedia({ type: 'video', url: vid.isTemp ? vid.url : `${Base_URL}/${vid.url || `uploads/chatVideo/${vid.fileName}`}` })}>
                                                            <video src={vid.isTemp ? vid.url : `${Base_URL}/${vid.url || `uploads/chatVideo/${vid.fileName}`}`} className={`max-w-[200px] rounded-xl shadow-sm ${msg.isSending ? 'opacity-60 blur-[2px]' : ''}`} />
                                                            {msg.isSending && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                    <div className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin shadow-sm"></div>
                                                                </div>
                                                            )}
                                                            {!msg.isSending && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-black/60 transition-colors shadow-lg">
                                                                        <svg className="w-4 h-4 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {msg.attachments?.filter(a => a.mimeType?.startsWith('audio/')).length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    {msg.attachments.filter(a => a.mimeType?.startsWith('audio/')).map((aud, idx) => (
                                                        <div key={idx} className="relative">
                                                            <audio src={aud.isTemp ? aud.url : `${Base_URL}/${aud.url || `uploads/chatAudio/${aud.fileName}`}`} controls className={`w-[200px] h-10 ${msg.isSending ? 'opacity-50 pointer-events-none' : ''}`} />
                                                            {msg.isSending && (
                                                                <div className="absolute -right-5 top-1/2 -translate-y-1/2">
                                                                    <div className="w-3 h-3 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {msg.attachments?.filter(a => !a.mimeType?.startsWith('image/') && !a.mimeType?.startsWith('video/') && !a.mimeType?.startsWith('audio/')).length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    {msg.attachments.filter(a => !a.mimeType?.startsWith('image/') && !a.mimeType?.startsWith('video/') && !a.mimeType?.startsWith('audio/')).map((doc, idx) => (
                                                        <a key={idx} href={doc.isTemp ? '#' : `${Base_URL}/${doc.url || `uploads/chatDocument/${doc.fileName}`}`} target={doc.isTemp ? undefined : "_blank"} rel="noreferrer" className={`flex items-center gap-2 text-xs font-bold underline p-2 rounded-lg shadow-sm border ${isMe ? 'bg-indigo-100/50 border-indigo-200 text-indigo-800' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'} ${msg.isSending ? 'opacity-60 pointer-events-none' : ''}`}>
                                                            {msg.isSending ? (
                                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                            ) : "📄"}
                                                            {doc.originalName || doc.fileName}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.message && <span className="break-words mr-8">{msg.message}</span>}
                                            <div className={`absolute bottom-1 right-2 flex items-center gap-1 font-bold ${isMe ? 'text-indigo-400' : 'text-gray-400'}`}>
                                                <span className="text-[9px]">
                                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                </span>
                                                {msg.isSending && (
                                                    <svg className="w-3 h-3 animate-spin opacity-70" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 sticky bottom-0">
                    {attachments.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-thin">
                            {attachments.map((file, idx) => (
                                <div key={idx} className="relative flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium pr-8 border border-gray-200 dark:border-gray-700">
                                    <span className="truncate max-w-[100px] dark:text-white">{file.name}</span>
                                    <button type="button" onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="absolute right-2 text-gray-400 hover:text-red-500">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="relative flex items-center group bg-gray-50 dark:bg-gray-800 rounded-2xl p-1 shadow-inner">
                        <label className="p-3 ml-1 cursor-pointer text-gray-400 hover:text-brand transition-colors rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700" title="Attach Files">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            <input type="file" multiple className="hidden" onChange={(e) => setAttachments(prev => [...prev, ...Array.from(e.target.files)])} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" />
                        </label>
                        <button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-3 mr-1 transition-colors rounded-xl ${isRecording ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-brand hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            title={isRecording ? "Stop Recording" : "Record Voice Message"}
                        >
                            {isRecording ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                            )}
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onInput={handleTyping}
                            placeholder="Type your reply..."
                            className="w-full pl-3 pr-24 py-3.5 rounded-xl bg-transparent text-sm transition-all outline-none text-gray-900 dark:text-white"
                        />
                        <div className="absolute right-1.5 flex items-center gap-1">
                            <button
                                type="submit"
                                disabled={!newMessage.trim() && attachments.length === 0}
                                className="bg-brand text-black px-6 py-2.5 rounded-xl font-black text-[10px] tracking-[0.1em] shadow-xl shadow-brand/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 uppercase"
                            >
                                Send Reply
                            </button>
                        </div>
                    </form>
                    <p className="text-[9px] text-center text-gray-400 mt-2 font-medium uppercase tracking-[0.2em]">Press enter to send your message</p>
                </div>
            </div>

            {/* INFO PANEL (SIDEBAR) */}
            {showInfo && ticket && (
                <div className="w-85 border-l border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl">
                    <div className="p-8 space-y-10">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Ticket Identity</h4>
                            <span className="w-4 h-4 rounded-full bg-brand/10 text-brand flex items-center justify-center scale-75">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
                            </span>
                        </div>

                        <div className={`p-6 rounded-[2rem] border-2 shadow-sm ${ticket.priority === 'HIGH' ? 'bg-red-50/20 border-red-50 dark:border-red-900/10' :
                            ticket.priority === 'MEDIUM' ? 'bg-yellow-50/20 border-yellow-50 dark:border-yellow-900/10' :
                                'bg-blue-50/20 border-blue-50 dark:border-blue-900/10'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${ticket.priority === 'HIGH' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                    ticket.priority === 'MEDIUM' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' :
                                        'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    }`}>
                                    {ticket.priority || 'NORMAL'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ticket.status}</span>
                            </div>
                            <p className="text-base font-black text-gray-900 dark:text-white leading-tight">{ticket.subject}</p>
                        </div>

                        {ticket.Image && (
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Evidence</h4>
                                <a href={`${Base_URL}/uploads/${ticket.Image}`} target="_blank" className="block relative group rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                                    <img src={`${Base_URL}/uploads/ticketImage/${ticket.Image}`} className="w-full aspect-square object-cover" alt="attach" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-all">
                                        <span className="text-white text-[10px] font-black bg-brand px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">Enlarge Image</span>
                                    </div>
                                </a>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Context</h4>
                            <div className="bg-gray-50/30 dark:bg-white/[0.01] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner">
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
                                    "{ticket.description}"
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Issue Reported On</p>
                            <p className="text-xs text-gray-600 dark:text-white font-bold">{new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX FOR IMAGES AND VIDEOS */}
            {lightboxMedia && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightboxMedia(null)}>
                    <button onClick={() => setLightboxMedia(null)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all shadow-lg hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </button>
                    {lightboxMedia.type === 'image' && (
                        <img src={lightboxMedia.url} onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in duration-300" alt="Preview" />
                    )}
                    {lightboxMedia.type === 'video' && (
                        <video src={lightboxMedia.url} controls autoPlay onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl animate-in zoom-in duration-300" />
                    )}
                </div>
            )}
        </div>
    );
}