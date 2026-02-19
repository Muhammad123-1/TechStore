import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { setCookie, getCookie } from '../../utils/cookieUtils.js';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasConsented, setHasConsented] = useState(false);

    useEffect(() => {
        // Check if user has already made a cookie choice
        const cookieConsent = getCookie('cookieConsent');
        if (!cookieConsent) {
            setShowBanner(true);
        } else {
            setHasConsented(true);
        }
    }, []);

    const handleAcceptAll = () => {
        setCookie('cookieConsent', JSON.stringify({
            functional: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        }), 365);
        setShowBanner(false);
        setShowModal(false);
        setHasConsented(true);
    };

    const handleRejectAll = () => {
        setCookie('cookieConsent', JSON.stringify({
            functional: true, // Always required
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        }), 365);
        setShowBanner(false);
        setShowModal(false);
        setHasConsented(true);
    };

    const handleSavePreferences = () => {
        const functional = document.getElementById('functional-consent').checked;
        const analytics = document.getElementById('analytics-consent').checked;
        const marketing = document.getElementById('marketing-consent').checked;

        setCookie('cookieConsent', JSON.stringify({
            functional,
            analytics,
            marketing,
            timestamp: new Date().toISOString()
        }), 365);
        setShowBanner(false);
        setShowModal(false);
        setHasConsented(true);
    };

    // Render banner only if not consented
    if (!showBanner && !hasConsented) return null;

    return (
        <>
            {/* Compact Banner - Bottom Right Corner */}
            {showBanner && (
                <div className="fixed bottom-6 right-6 bg-dark-card border-2 border-primary rounded-xl shadow-2xl z-50 max-w-xs p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute top-2 right-2 p-1 hover:bg-dark-secondary rounded-lg transition"
                    >
                        <X size={16} className="text-text-secondary" />
                    </button>

                    {/* Content */}
                    <div className="pr-5">
                        <h3 className="text-base font-bold text-text-primary mb-2">Cookie Ruxsatnomasi</h3>
                        <p className="text-text-secondary text-xs mb-3 leading-relaxed">
                            Sayt tajariba yaxshilash uchun cookie fayllardan foydalanamiz.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleRejectAll}
                                className="w-full px-3 py-2 bg-dark-secondary text-text-primary font-semibold rounded-lg hover:bg-dark-base transition text-xs border border-text-secondary/20"
                            >
                                Zaruriy Tashlab Qol
                            </button>

                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full flex items-center justify-center gap-1 text-primary hover:text-primary/80 font-semibold text-xs transition"
                            >
                                <ChevronDown size={14} />
                                Tafsilotlarni Ko'rish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Button - Shows when already consented */}
            {hasConsented && !showBanner && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 bg-primary/20 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition text-sm font-semibold z-40"
                >
                    Cookie Sozlamalari
                </button>
            )}

            {/* Modal Overlay - Background */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
                    onClick={() => setShowModal(false)}
                />
            )}

            {/* Modal - Details */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-dark-card rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-primary/30">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-primary/90 to-primary/70 text-white p-5 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold">Cookie Ruxsatnomasi</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-primary/80 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-5">
                            {/* Intro Text */}
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Saytimiz sizga eng yaxshi tajribani berish uchun cookie fayllardan foydalanadi. Quyidagi cookie fayllardan qaysilaridan foydalanishimizni tanlashingiz mumkin.
                            </p>

                            {/* Functional Cookies */}
                            <div className="border border-primary/30 rounded-lg p-3 bg-dark-secondary/50">
                                <label className="flex items-start gap-3 cursor-not-allowed">
                                    <input
                                        type="checkbox"
                                        id="functional-consent"
                                        defaultChecked={true}
                                        disabled
                                        className="w-5 h-5 text-primary bg-dark-base border-primary/50 rounded mt-0.5 cursor-not-allowed flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm">Zarur Cookie Fayllar</p>
                                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                            Saytni ishlashini ta'minlash uchun zarur. Autentifikatsiya, xavfsizlik, sessiyon boshqaruvi, to'lov.
                                        </p>
                                        <div className="mt-2 bg-dark-card rounded px-2 py-1.5 border border-primary/20">
                                            <p className="text-xs font-mono text-primary">
                                                <strong>Cookie:</strong> sessionId, accessToken, refreshToken
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-primary whitespace-nowrap flex-shrink-0">ZARUR</span>
                                </label>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border border-primary/20 rounded-lg p-3 bg-dark-card hover:bg-dark-secondary/50 transition">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="analytics-consent"
                                        defaultChecked={true}
                                        className="w-5 h-5 text-primary bg-dark-base border-primary/50 rounded cursor-pointer mt-0.5 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm">Tahlil Cookie Fayllar</p>
                                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                            Foydalanuvchilar qanday o'zaro aloqada bo'lishini tushunish uchun anonim ma'lumotlarni to'plash. Shaxsiy ma'lumot yo'q.
                                        </p>
                                        <div className="mt-2 bg-dark-base rounded px-2 py-1.5 border border-primary/20">
                                            <p className="text-xs font-mono text-text-secondary">
                                                <strong className="text-text-primary">Provider:</strong> Google Analytics<br/>
                                                <strong className="text-text-primary">Maqsad:</strong> Sayt yaxshilash
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border border-primary/20 rounded-lg p-3 bg-dark-card hover:bg-dark-secondary/50 transition">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="marketing-consent"
                                        defaultChecked={true}
                                        className="w-5 h-5 text-primary bg-dark-base border-primary/50 rounded cursor-pointer mt-0.5 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm">Marketing Cookie Fayllar</p>
                                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                            Reklama kampaniyalari samaradorligini o'lchash uchun. Bunga ruxsat berishingiz ixtiyoriy.
                                        </p>
                                        <div className="mt-2 bg-dark-base rounded px-2 py-1.5 border border-primary/20">
                                            <p className="text-xs font-mono text-text-secondary">
                                                <strong className="text-text-primary">Provider:</strong> Facebook Pixel, Google Ads
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Token Storage Info */}
                            <div className="border-2 border-primary rounded-lg p-3 bg-dark-secondary/50">
                                <p className="font-bold text-text-primary text-sm mb-2">Kirish Token Fayllar (Zarur)</p>
                                <div className="space-y-2">
                                    <div className="bg-dark-card rounded px-3 py-2 border border-primary/30">
                                        <p className="font-semibold text-text-primary text-xs mb-0.5">accessToken</p>
                                        <p className="text-text-secondary text-xs">
                                            15 minutga saqlangan hisobga kirish litsenziyasi
                                        </p>
                                        <p className="text-xs text-primary mt-1">Xavfsiz: HttpOnly + Secure bayraqlar</p>
                                    </div>
                                    <div className="bg-dark-card rounded px-3 py-2 border border-primary/30">
                                        <p className="font-semibold text-text-primary text-xs mb-0.5">refreshToken</p>
                                        <p className="text-text-secondary text-xs">
                                            7 kunga saqlangan qayta kirish kalit
                                        </p>
                                        <p className="text-xs text-primary mt-1">Xavfsiz: HttpOnly + Secure bayraqlar</p>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary mt-2 italic">
                                    Bu cookie fayllar hisobingizni xavfsiz saqlash uchun zarur.
                                </p>
                            </div>

                            {/* Legal Info */}
                            <div className="bg-dark-secondary rounded-lg p-3 border border-primary/20">
                                <p className="text-text-secondary text-xs">
                                    Batafsil ma'lumot uchun <a href="/privacy-policy" className="text-primary hover:underline font-semibold">Maxfiylik Siyosati</a> ga qarang.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer - Sticky Action Buttons */}
                        <div className="sticky bottom-0 bg-dark-secondary border-t border-primary/20 p-4 flex flex-wrap gap-2 rounded-b-2xl">
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 min-w-[140px] px-4 py-2 bg-primary text-dark-base font-bold rounded-lg hover:bg-primary/90 transition text-sm"
                            >
                                Hammasi Qabul Qil
                            </button>

                            <button
                                onClick={handleRejectAll}
                                className="flex-1 min-w-[140px] px-4 py-2 bg-dark-base text-text-primary font-bold rounded-lg hover:bg-dark-card transition text-sm border border-text-secondary/20"
                            >
                                Zaruriy Tashlab Qol
                            </button>

                            <button
                                onClick={handleSavePreferences}
                                className="flex-1 min-w-[140px] px-4 py-2 bg-dark-card text-text-primary font-bold border-2 border-primary rounded-lg hover:bg-dark-secondary transition text-sm"
                            >
                                Mening Tanlovim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

    return (
        <>
            {/* Compact Banner - Bottom Right Corner */}
            <div className="fixed bottom-6 right-6 bg-dark-card border-2 border-primary rounded-xl shadow-2xl z-50 max-w-xs p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Close Button */}
                <button
                    onClick={() => setShowBanner(false)}
                    className="absolute top-2 right-2 p-1 hover:bg-dark-secondary rounded-lg transition"
                >
                    <X size={16} className="text-text-secondary" />
                </button>

                {/* Content */}
                <div className="pr-5">
                    <h3 className="text-base font-bold text-text-primary mb-2">Cookie Ruxsatnomasi</h3>
                    <p className="text-text-secondary text-xs mb-3 leading-relaxed">
                        Sayt tajariba yaxshilash uchun cookie fayllardan foydalanamiz.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleRejectAll}
                            className="w-full px-3 py-2 bg-dark-secondary text-text-primary font-semibold rounded-lg hover:bg-dark-base transition text-xs border border-text-secondary/20"
                        >
                            Zaruriy Tashlab Qol
                        </button>

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full flex items-center justify-center gap-1 text-primary hover:text-primary/80 font-semibold text-xs transition"
                        >
                            <ChevronDown size={14} />
                            Tafsilotlarni Ko'rish
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay - Background */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
                    onClick={() => setShowModal(false)}
                />
            )}

            {/* Modal - Details */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-dark-card rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-primary/30">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-primary/90 to-primary/70 text-white p-5 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold">Cookie Ruxsatnomasi</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-primary/80 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-5">
                            {/* Intro Text */}
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Saytimiz sizga eng yaxshi tajribani berish uchun cookie fayllardan foydalanadi. Quyidagi cookie fayllardan qaysilaridan foydalanishimizni tanlashingiz mumkin.
                            </p>

                            {/* Functional Cookies */}
                            <div className="border border-primary/30 rounded-lg p-3 bg-dark-secondary/50">
                                <label className="flex items-start gap-3 cursor-not-allowed">
                                    <input
                                        type="checkbox"
                                        id="functional-consent"
                                        defaultChecked={true}
                                        disabled
                                        className="w-5 h-5 text-primary bg-dark-base border-primary/50 rounded mt-0.5 cursor-not-allowed flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm">Zarur Cookie Fayllar</p>
                                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                            Saytni ishlashini ta'minlash uchun zarur. Autentifikatsiya, xavfsizlik, sessiyon boshqaruvi, to'lov.
                                        </p>
                                        <div className="mt-2 bg-dark-card rounded px-2 py-1.5 border border-primary/20">
                                            <p className="text-xs font-mono text-primary">
                                                <strong>Cookie:</strong> sessionId, accessToken, refreshToken
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-primary whitespace-nowrap flex-shrink-0">ZARUR</span>
                                </label>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border border-primary/20 rounded-lg p-3 bg-dark-card hover:bg-dark-secondary/50 transition">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="analytics-consent"
                                        defaultChecked={true}
                                        className="w-5 h-5 text-primary bg-dark-base border-primary/50 rounded cursor-pointer mt-0.5 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm">Tahlil Cookie Fayllar</p>
                                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                            Foydalanuvchilar qanday o'zaro aloqada bo'lishini tushunish uchun anonim ma'lumotlarni to'plash. Shaxsiy ma'lumot yo'q.
                                        </p>
                                        <div className="mt-2 bg-dark-base rounded px-2 py-1.5 border border-primary/20">
                                            <p className="text-xs font-mono text-text-secondary">
                                                <strong className="text-text-primary">Provider:</strong> Google Analytics<br/>
                                                <strong className="text-text-primary">Maqsad:</strong> Sayt yaxshilash
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border border-primary/20 rounded-lg p-3 bg-dark-card hover:bg-dark-secondary/50 transition">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="marketing-consent"
                                        defaultChecked={true}
                                        className="w-5 h-5 text-primary bg-dark-base border-primary/50 rounded cursor-pointer mt-0.5 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary text-sm">Marketing Cookie Fayllar</p>
                                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                            Reklama kampaniyalari samaradorligini o'lchash uchun. Bunga ruxsat berishingiz ixtiyoriy.
                                        </p>
                                        <div className="mt-2 bg-dark-base rounded px-2 py-1.5 border border-primary/20">
                                            <p className="text-xs font-mono text-text-secondary">
                                                <strong className="text-text-primary">Provider:</strong> Facebook Pixel, Google Ads
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Token Storage Info */}
                            <div className="border-2 border-primary rounded-lg p-3 bg-dark-secondary/50">
                                <p className="font-bold text-text-primary text-sm mb-2">Kirish Token Fayllar (Zarur)</p>
                                <div className="space-y-2">
                                    <div className="bg-dark-card rounded px-3 py-2 border border-primary/30">
                                        <p className="font-semibold text-text-primary text-xs mb-0.5">accessToken</p>
                                        <p className="text-text-secondary text-xs">
                                            15 minutga saqlangan hisobga kirish litsenziyasi
                                        </p>
                                        <p className="text-xs text-primary mt-1">Xavfsiz: HttpOnly + Secure bayraqlar</p>
                                    </div>
                                    <div className="bg-dark-card rounded px-3 py-2 border border-primary/30">
                                        <p className="font-semibold text-text-primary text-xs mb-0.5">refreshToken</p>
                                        <p className="text-text-secondary text-xs">
                                            7 kunga saqlangan qayta kirish kalit
                                        </p>
                                        <p className="text-xs text-primary mt-1">Xavfsiz: HttpOnly + Secure bayraqlar</p>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary mt-2 italic">
                                    Bu cookie fayllar hisobingizni xavfsiz saqlash uchun zarur.
                                </p>
                            </div>

                            {/* Legal Info */}
                            <div className="bg-dark-secondary rounded-lg p-3 border border-primary/20">
                                <p className="text-text-secondary text-xs">
                                    Batafsil ma'lumot uchun <a href="/privacy-policy" className="text-primary hover:underline font-semibold">Maxfiylik Siyosati</a> ga qarang.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer - Sticky Action Buttons */}
                        <div className="sticky bottom-0 bg-dark-secondary border-t border-primary/20 p-4 flex flex-wrap gap-2 rounded-b-2xl">
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 min-w-[140px] px-4 py-2 bg-primary text-dark-base font-bold rounded-lg hover:bg-primary/90 transition text-sm"
                            >
                                Hammasi Qabul Qil
                            </button>

                            <button
                                onClick={handleRejectAll}
                                className="flex-1 min-w-[140px] px-4 py-2 bg-dark-base text-text-primary font-bold rounded-lg hover:bg-dark-card transition text-sm border border-text-secondary/20"
                            >
                                Zaruriy Tashlab Qol
                            </button>

                            <button
                                onClick={handleSavePreferences}
                                className="flex-1 min-w-[140px] px-4 py-2 bg-dark-card text-text-primary font-bold border-2 border-primary rounded-lg hover:bg-dark-secondary transition text-sm"
                            >
                                Mening Tanlovim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
