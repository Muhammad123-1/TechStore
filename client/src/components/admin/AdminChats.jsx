import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, MessageSquare, Headphones, ShoppingBag, X, RefreshCw, User } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminChats() {
    const { t } = useTranslation();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active');
    const [typeFilter, setTypeFilter] = useState('all');
    const pollRef = useRef(null);
    // Removed scrollToBottom as requested


    // Fetch all chats
    const fetchChats = async () => {
        try {
            const params = { status: filter };
            if (typeFilter !== 'all') params.type = typeFilter;
            const res = await api.get('/chats', { params });
            setChats(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch chats', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [filter, typeFilter]);

    // Poll chats list every 5s
    useEffect(() => {
        const interval = setInterval(fetchChats, 5000);
        return () => clearInterval(interval);
    }, [filter, typeFilter]);

    // Poll active chat messages every 3s
    useEffect(() => {
        if (!activeChat) return;

        const pollMessages = async () => {
            try {
                const res = await api.get(`/chats/${activeChat._id}`);
                setActiveChat(res.data.data);
            } catch (err) { /* silent */ }
        };

        pollRef.current = setInterval(pollMessages, 3000);
        return () => clearInterval(pollRef.current);
    }, [activeChat?._id]);

    // removed scrollToBottom effect


    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        const text = input.trim();
        setInput('');

        try {
            const res = await api.post(`/chats/${activeChat._id}/messages`, { text });
            setActiveChat(res.data.data);
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    const handleCloseChat = async (chatId) => {
        try {
            await api.put(`/chats/${chatId}/close`);
            toast.success(t('admin.chat.closed', 'Chat closed'));
            setActiveChat(null);
            fetchChats();
        } catch (err) {
            toast.error('Failed to close chat');
        }
    };

    const totalUnread = chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[75vh]">

            {/* CHAT LIST SIDEBAR */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-dark-secondary rounded-2xl border border-border-color overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border-color">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <MessageSquare size={20} className="text-primary" />
                            {t('admin.chat.title', 'Chats')}
                            {totalUnread > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                    {totalUnread}
                                </span>
                            )}
                        </h2>
                        <button onClick={fetchChats} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-1 mb-2">
                        {['active', 'closed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
                            >
                                {s === 'active' ? t('admin.chat.active', 'Active') : t('admin.chat.closedFilter', 'Closed')}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {['all', 'support', 'sales'].map(tp => (
                            <button
                                key={tp}
                                onClick={() => setTypeFilter(tp)}
                                className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${typeFilter === tp ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
                            >
                                {tp === 'all' ? t('admin.chat.all', 'All') : tp === 'support' ? t('chat.supportTitle', 'Support') : t('chat.salesTitle', 'Sales')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="p-6 text-center text-text-secondary text-sm">
                            {t('admin.chat.noChats', 'No chats found')}
                        </div>
                    ) : (
                        chats.map(chat => {
                            const lastMsg = chat.messages?.[chat.messages.length - 1];
                            const isActive = activeChat?._id === chat._id;
                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => setActiveChat(chat)}
                                    className={`w-full text-left p-4 border-b border-border-color/50 hover:bg-white/5 transition-colors ${isActive ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${chat.type === 'sales' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {chat.type === 'sales' ? <ShoppingBag size={18} /> : <Headphones size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm truncate">
                                                    {chat.userName || chat.user?.name || 'Guest'}
                                                </span>
                                                {chat.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-text-secondary truncate mt-0.5">
                                                {lastMsg?.text || t('admin.chat.noMessages', 'No messages yet')}
                                            </p>
                                            <p className="text-[10px] text-text-secondary/60 mt-1">
                                                {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* CHAT WINDOW */}
            <div className="flex-1 flex flex-col bg-dark-secondary rounded-2xl border border-border-color overflow-hidden">
                {!activeChat ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-3">
                        <MessageSquare size={48} className="text-primary/30" />
                        <p className="text-sm">{t('admin.chat.selectChat', 'Select a chat to start responding')}</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${activeChat.type === 'sales' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {activeChat.type === 'sales' ? <ShoppingBag size={20} /> : <Headphones size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">
                                        {activeChat.userName || activeChat.user?.name || 'Guest'}
                                    </h3>
                                    <p className="text-xs text-text-secondary">
                                        {activeChat.userEmail || activeChat.user?.email || ''} • {activeChat.type === 'sales' ? t('chat.salesTitle') : t('chat.supportTitle')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {activeChat.status === 'active' && (
                                    <button
                                        onClick={() => handleCloseChat(activeChat._id)}
                                        className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors"
                                    >
                                        {t('admin.chat.closeChat', 'Close Chat')}
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveChat(null)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {activeChat.messages?.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`p-1.5 h-fit rounded-lg ${msg.sender === 'admin'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-white/5 text-text-secondary'
                                            }`}>
                                            {msg.sender === 'admin' ? <User size={16} /> : <User size={16} />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className={`text-[10px] font-medium ${msg.sender === 'admin' ? 'text-right text-primary' : 'text-text-secondary'}`}>
                                                {msg.senderName || (msg.sender === 'admin' ? 'Admin' : 'User')}
                                            </p>
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'admin'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-white/5 border border-white/10 text-text-primary rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <p className={`text-[10px] text-text-secondary/60 ${msg.sender === 'admin' ? 'text-right' : ''}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* removed ref for auto-scrolling */}

                        </div>

                        {/* Input (only if chat is active) */}
                        {activeChat.status === 'active' && (
                            <div className="p-4 border-t border-border-color bg-white/5">
                                <form onSubmit={handleSend} className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={t('admin.chat.replyPlaceholder', 'Type your reply...')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 pr-14 focus:outline-none focus:ring-1 focus:ring-primary text-sm placeholder:text-text-secondary/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${input.trim()
                                            ? 'bg-primary text-white hover:scale-105 active:scale-95'
                                            : 'bg-white/10 text-white/20 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
