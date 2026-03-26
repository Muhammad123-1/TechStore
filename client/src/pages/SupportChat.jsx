import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Headphones, ShoppingBag, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

// Returns a stable guest ID stored in localStorage
function getGuestId() {
    let id = localStorage.getItem('chatGuestId');
    if (!id) {
        id = 'guest_' + Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem('chatGuestId', id);
    }
    return id;
}

export default function SupportChat() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const chatType = searchParams.get('type') || 'support';

    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);
    const guestId = getGuestId();

    // Removed auto-scroll upon messages change as requested by the user


    // Initialize chat session
    useEffect(() => {
        const initChat = async () => {
            try {
                const payload = { type: chatType };
                if (!user) {
                    payload.guestId = guestId;
                    payload.userName = 'Guest';
                }
                const res = await api.post('/chats', payload);
                const chat = res.data.data;
                setChatId(chat._id);

                // Load existing messages or show welcome
                if (chat.messages && chat.messages.length > 0) {
                    setMessages(chat.messages);
                } else {
                    setMessages([{
                        _id: 'welcome',
                        sender: 'admin',
                        senderName: t('chat.agentName'),
                        text: chatType === 'sales' ? t('chat.welcomeSales') : t('chat.welcomeSupport'),
                        timestamp: new Date()
                    }]);
                }
            } catch (err) {
                console.error('Chat init error', err);
            } finally {
                setLoading(false);
            }
        };
        initChat();
    }, [chatType, user]);

    // Poll for new messages every 4 seconds
    useEffect(() => {
        if (!chatId) return;

        const poll = async () => {
            try {
                const payload = user ? {} : { guestId };
                const res = await api.get(`/chats/${chatId}`, { params: { guestId: !user ? guestId : undefined } });
                const incoming = res.data.data.messages;
                if (incoming && incoming.length > 0) {
                    // Always sync with server messages (include welcome if empty)
                    setMessages(prev => {
                        if (incoming.length !== prev.filter(m => m._id !== 'welcome').length) {
                            return incoming;
                        }
                        return prev;
                    });
                }
            } catch (err) { /* silent */ }
        };

        pollRef.current = setInterval(poll, 4000);
        return () => clearInterval(pollRef.current);
    }, [chatId, user]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !chatId) return;

        const text = input.trim();
        setInput('');

        // Optimistic local append
        const tempMsg = {
            _id: 'temp_' + Date.now(),
            sender: 'user',
            senderName: user?.name || 'You',
            text,
            timestamp: new Date()
        };
        setMessages(prev => {
            const real = prev.filter(m => m._id !== 'welcome');
            return [...real, tempMsg];
        });

        setIsTyping(true);
        try {
            const payload = { text };
            if (!user) payload.guestId = guestId;
            const res = await api.post(`/chats/${chatId}/messages`, payload);
            // Replace optimistic with confirmed server messages
            setMessages(res.data.data.messages);
        } catch (err) {
            console.error('Send message error', err);
        } finally {
            setIsTyping(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary py-8 sm:py-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-bg-secondary rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative backdrop-blur-xl">

                {/* GLOW DECORATION */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />

                {/* HEADER */}
                <header className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="p-2.5 bg-primary/20 rounded-2xl text-primary">
                                    {chatType === 'sales' ? <ShoppingBag size={24} /> : <Headphones size={24} />}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-secondary rounded-full" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">
                                    {chatType === 'sales' ? t('chat.salesTitle') : t('chat.supportTitle')}
                                </h1>
                                <p className="text-xs text-green-500 font-medium tracking-wide uppercase">
                                    {t('chat.statusOnline')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-text-secondary text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <ShieldCheck size={14} className="text-primary" />
                        <span>{t('security.secureChannel', 'SECURE 256-BIT CHANNEL')}</span>
                    </div>
                </header>

                {/* MESSAGES AREA */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg._id || idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`p-2 h-fit rounded-xl border ${msg.sender === 'user'
                                        ? 'bg-primary/10 border-primary/20 text-primary'
                                        : 'bg-white/5 border-white/10 text-primary'
                                        }`}>
                                        {msg.sender === 'user' ? <User size={18} /> : (chatType === 'sales' ? <ShoppingBag size={18} /> : <Headphones size={18} />)}
                                    </div>
                                    <div className="space-y-1">
                                        {msg.sender === 'admin' && (
                                            <p className="text-[10px] text-text-secondary font-medium pl-1">{msg.senderName || t('chat.agentName')}</p>
                                        )}
                                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-tr-none font-medium'
                                            : 'bg-white/5 border border-white/10 text-text-primary rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[10px] text-text-secondary ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-text-secondary text-xs italic ml-12"
                        >
                            <Zap size={12} className="animate-pulse text-yellow-500" />
                            {t('chat.agentName')} {t('chat.isTyping', 'is typing...')}
                        </motion.div>
                    )}
                    {/* removed ref to end of messages because auto-scroll was disabled */}

                </main>

                {/* INPUT AREA */}
                <footer className="p-6 bg-white/5 border-t border-white/10">
                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('chat.placeholder')}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all text-sm placeholder:text-text-secondary/50 group-hover:bg-white/[0.08]"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${input.trim()
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-100 hover:scale-105 active:scale-95'
                                : 'bg-white/10 text-white/20 scale-90 cursor-not-allowed'
                                }`}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-text-secondary/40 mt-3 font-medium tracking-tight">
                        © {new Date().getFullYear()} TechStore Security Network • {t('security.finalizing', 'Encrypted Connection')}
                    </p>
                </footer>
            </div>
        </div>
    );
}
