import { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Send } from 'lucide-react';

const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"],
});

const ChatPage = () => {
    const { roomId } = useParams(); // Use Job ID as the Room ID
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);

    useEffect(() => {
        if (!roomId) return;

        setChatLog([]);
        console.log('Emitting join_room', roomId, 'connected?', socket.connected);
        socket.emit("join_room", roomId);

        socket.on("receive_message", (data) => {
            console.log('receive_message event', data);
            // Avoid duplicates: check if message already exists
            setChatLog((prev) => {
                const isDuplicate = prev.some(msg => msg.message === data.message && msg.senderId === data.senderId);
                if (isDuplicate) return prev;
                return [...prev, data];
            });
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id, "roomId:", roomId);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connect error:", err);
        });

        socket.on("disconnect", (reason) => {
            console.warn("Socket disconnected:", reason);
        });

        return () => {
            socket.off("receive_message");
            socket.off("connect");
            socket.off("connect_error");
            socket.off("disconnect");
        };
    }, [roomId]);

    const sendMessage = (e) => {
        if (e) e.preventDefault();
        if (!message.trim() || !roomId) return;

        const messageData = {
            room: roomId,
            author: user?.name || "Me",
            senderId: user?._id,
            message: message.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        console.log('Sending message', messageData);
        setChatLog((prev) => [...prev, messageData]);
        socket.emit("send_message", messageData);
        setMessage("");
    };

    const handleDelivery = () => {
        // Add your delivery handler logic here
        console.log('Marked as delivered');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Phone Frame Container */}
            <div className="w-full max-w-md h-[600px] bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">U</div>
                    <div className="flex-1">
                        <h2 className="font-bold text-white">Project Discussion</h2>
                        <p className="text-xs text-blue-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            Active Now
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {chatLog.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Send size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-sm">No messages yet</p>
                            </div>
                        </div>
                    ) : (
                        chatLog.map((msg, index) => {
                            const isOwnMessage = msg.senderId && user?._id && msg.senderId === user._id;
                            return (
                                <div key={index} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${isOwnMessage ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-300 text-gray-900 rounded-bl-none"}`}>
                                        {!isOwnMessage && <p className="text-xs opacity-70 mb-1 font-semibold text-gray-700">{msg.author}</p>}
                                        <p className="text-sm break-words">{msg.message}</p>
                                        <p className={`text-[11px] mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-600"}`}>{msg.time}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-3 bg-white border-t flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={message}
                            placeholder="Type a message..."
                            className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex-shrink-0">
                            <Send size={18} />
                        </button>
                    </div>
                    {user?.role === 'worker' && (
                        <button 
                            onClick={handleDelivery}
                            type="button"
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
                        >
                            Mark as Delivered
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChatPage;