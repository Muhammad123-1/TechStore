import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SecurityLoader() {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [textIndex, setTextIndex] = useState(0);

    const texts = [
        t('security.checking'),
        t('security.verifying'),
        t('security.ready'),
        t('security.finalizing'),
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                const jump = prev < 80 ? 2 : 0.5;
                return Math.min(prev + jump, 100);
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % texts.length);
        }, 2500);

        return () => clearInterval(textInterval);
    }, [texts.length]);

    return (
        <div className="fixed inset-0 z-[100000] h-screen w-full bg-bg-base flex flex-col items-center justify-center text-text-primary overflow-hidden font-sans select-none" style={{ backgroundColor: 'var(--color-bg-base)' }}>
            {/* Ensure background is solid */}
            <div className="absolute inset-0 bg-bg-base z-[-1]" />

            {/* BACKGROUND SCANNING GRID */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(var(--color-primary-rgb), 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <motion.div
                    className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 border-y border-primary/20"
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
            </div>

            {/* AMBIENT GLOW */}
            <motion.div
                className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            {/* CONTENT CONTAINER */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm w-full"
            >
                {/* LOGO AREA */}
                <div className="relative mb-12">
                    <motion.div
                        className="absolute -inset-4 bg-primary/20 rounded-full blur-xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    />
                    <motion.h1
                        className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-text-primary to-purple-400"
                        animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        style={{ backgroundSize: '200% auto' }}
                    >
                        TechStore
                    </motion.h1>
                    <motion.div
                        className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent mt-2"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    />
                </div>

                {/* LOADING BOX */}
                <div className="w-full bg-bg-card/40 backdrop-blur-xl border border-border/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Subtle scanning line within box */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-0.5 bg-primary/30"
                        animate={{ top: ["0%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />

                    <div className="h-10 flex items-center justify-center mb-6">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={textIndex}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                className="text-sm font-semibold text-text-primary uppercase tracking-widest"
                            >
                                {texts[textIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* PROGRESS BAR CONTAINER */}
                    <div className="relative w-full h-1.5 bg-border/20 rounded-full overflow-hidden mb-3">
                        {/* GLOWING BAR */}
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-blue-400 to-purple-600 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut", duration: 0.3 }}
                        />
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-primary/70 tracking-tighter uppercase">{t('security.secureChannel')}</span>
                        <motion.span className="text-xs font-mono text-text-secondary">
                            {Math.round(progress)}%
                        </motion.span>
                    </div>
                </div>

                {/* STATUS INDICATORS */}
                <div className="mt-12 flex gap-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary/50"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* FOOTER INFO */}
            <div className="absolute bottom-8 text-[10px] text-text-secondary uppercase tracking-[0.2em] font-medium opacity-60">
                {t('security.systemInfo')}
            </div>
        </div>
    );
}

