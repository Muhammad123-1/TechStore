import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState("");
    const [isGlitching, setIsGlitching] = useState(false);

    // Random glitch effect trigger
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);
        }, 3000);
        return () => clearInterval(glitchInterval);
    }, []);

    const glitchVariants = {
        glitch: {
            x: [0, -2, 2, -1, 1, 0],
            y: [0, 1, -1, 2, -2, 0],
            filter: [
                "none",
                "hue-rotate(90deg) blur(1px)",
                "hue-rotate(-90deg) blur(1px)",
                "none"
            ],
            transition: { duration: 0.2 }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
        } else {
            navigate('/products');
        }
    };

    return (
        <div className="h-screen w-full bg-bg-base text-text-primary flex flex-col items-center justify-center relative overflow-hidden font-sans px-4 transition-colors duration-500">

            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 transition-colors duration-700" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] opacity-30 transition-colors duration-700" />
            </div>

            {/* MATRIX/TEXTURE OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0" />

            <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center">

                {/* GLITCHY 404 */}
                <div className="relative mb-8">
                    <motion.h1
                        variants={glitchVariants}
                        animate={isGlitching ? "glitch" : "none"}
                        className="text-9xl md:text-[12rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-text-primary via-primary to-blue-900 leading-none select-none drop-shadow-sm"
                    >
                        404
                    </motion.h1>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 blur-sm" />
                </div>

                {/* AI MESSAGE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                        {t('notFound.title')}
                    </h2>
                    <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto leading-relaxed font-medium">
                        <span className="text-primary font-mono font-bold">AI:</span> {t('notFound.aiMessage')}
                    </p>
                </motion.div>

                {/* FUNCTIONAL SEARCH BAR */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-md mb-12 relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition duration-500" />
                    <div className="relative flex items-center bg-bg-card/40 border border-border/10 rounded-2xl p-1 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                        <div className="pl-4 text-text-secondary">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder={t('notFound.searchPlaceholder')}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 px-4 outline-none placeholder:text-text-secondary/50 text-text-primary"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/80 text-white transition-all px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 mr-1"
                        >
                            {t('notFound.searchButton')}
                        </button>
                    </div>
                </motion.form>

                {/* ACTIONS */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-bg-card/40 hover:bg-bg-card/60 border border-border/10 rounded-2xl transition-all duration-300 backdrop-blur-md shadow-sm"
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform w-5 h-5 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider text-text-primary">{t('notFound.backButton')}</span>
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">{t('notFound.homeButton')}</span>
                    </button>
                </motion.div>

                {/* STATUS BAR ANIMATION */}
                <div className="mt-16 flex items-center gap-2 opacity-30">
                    <div className="text-[10px] font-mono tracking-widest uppercase">Scanning Sectors</div>
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                    />
                </div>

            </div>
        </div>
    );
}
