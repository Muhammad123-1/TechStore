import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { setCookie, getCookie } from '../../utils/cookieUtils.js';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if user has already made a cookie choice
        const cookieConsent = getCookie('cookieConsent');
        if (!cookieConsent) {
            setShowBanner(true);
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
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Compact Banner - Bottom Right Corner */}
            <div className="fixed bottom-6 right-6 bg-white border-2 border-blue-500 rounded-xl shadow-2xl z-50 max-w-sm p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Close Button */}
                <button
                    onClick={() => setShowBanner(false)}
                    className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-lg transition"
                >
                    <X size={18} className="text-gray-500" />
                </button>

                {/* Content */}
                <div className="pr-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">🍪 Cookie Ruxsatnomasi</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        Biz sayt tajariba yaxshilash uchun cookie fayllardan foydalanamiz.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mb-3">
                        <button
                            onClick={handleAcceptAll}
                            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            ✅ Hammasi Qabul Qil
                        </button>

                        <button
                            onClick={handleRejectAll}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition text-sm"
                        >
                            ❌ Zaruriy Tashlab Qol
                        </button>
                    </div>

                    {/* Details Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                    >
                        <ChevronDown size={16} />
                        Tafsilotlarni Ko'rish
                    </button>
                </div>
            </div>

            {/* Modal Overlay - Background */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={() => setShowModal(false)}
                />
            )}

            {/* Modal - Details */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold">🍪 Cookie Ruxsatnomasi</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-blue-500 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Intro Text */}
                            <p className="text-gray-600 text-base leading-relaxed">
                                Saytimiz sizga eng yaxshi tajribani berish uchun cookie fayllardan foydalanadi. Cookie fayllar siz qanday cookie fayllardan foydalanamizni tanlashingiz mumkin.
                            </p>

                            {/* Functional Cookies */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <label className="flex items-start gap-4 cursor-not-allowed">
                                    <input
                                        type="checkbox"
                                        id="functional-consent"
                                        defaultChecked={true}
                                        disabled
                                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded mt-1 cursor-not-allowed"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-lg">⚙️ Zarur Cookie Fayllar</p>
                                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                            Saytni ishlashini ta'minlash uchun zarur. Masalan: autentifikatsiya, xavfsizlik, sessiyon boshqaruvi, to'lov.
                                        </p>
                                        <div className="mt-3 bg-white rounded px-3 py-2 border border-gray-300">
                                            <p className="text-xs font-mono text-gray-700">
                                                <strong>Cookie nomlari:</strong> sessionId, accessToken, refreshToken
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 mt-1 whitespace-nowrap">ZARUR</span>
                                </label>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition">
                                <label className="flex items-start gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="analytics-consent"
                                        defaultChecked={true}
                                        className="w-6 h-6 text-blue-600 bg-white border-gray-300 rounded cursor-pointer mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-lg">📊 Tahlil Cookie Fayllar</p>
                                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                            Foydalanuvchilar qanday o'zaro aloqada bo'lishini tushunish uchun anonim ma'lumotlarni to'plash. <strong>Shaxsiy ma'lumot yo'q.</strong> Sizning qaysi sahifalarni ko'rayotganingiz, qancha vaqt o'tkazayotganingizni ko'rishimizga yordam beradi.
                                        </p>
                                        <div className="mt-3 bg-gray-50 rounded px-3 py-2 border border-gray-300">
                                            <p className="text-xs font-mono text-gray-700">
                                                <strong>Provider:</strong> Google Analytics (anonim)<br/>
                                                <strong>Maqsad:</strong> Sayt ishlashini yaxshilash
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition">
                                <label className="flex items-start gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="marketing-consent"
                                        defaultChecked={true}
                                        className="w-6 h-6 text-blue-600 bg-white border-gray-300 rounded cursor-pointer mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-lg">📢 Marketing Cookie Fayllar</p>
                                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                            Sizga tegishli reklamalarni ko'rsatish va kampaniyalar samaradorligini o'lchaш uchun. <strong>Bunga ruxsat berishingiz ixtiyoriy.</strong> Bu cookie fayllar tashvish qilmang — faqat reklama ko'rsatish uchun ishlatiladi.
                                        </p>
                                        <div className="mt-3 bg-gray-50 rounded px-3 py-2 border border-gray-300">
                                            <p className="text-xs font-mono text-gray-700">
                                                <strong>Provider:</strong> Facebook Pixel, Google Ads<br/>
                                                <strong>Maqsad:</strong> Reklama kampaniyalari
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Token Storage Info */}
                            <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-4">
                                <p className="font-bold text-gray-900 text-lg mb-3">🔐 Kirish Token Fayllar (Zarur)</p>
                                <div className="space-y-3">
                                    <div className="bg-white rounded px-4 py-3 border border-blue-200">
                                        <p className="font-semibold text-gray-900 text-sm mb-1">accessToken</p>
                                        <p className="text-gray-600 text-sm">
                                            15 minutga saqlangan hisobga kirish litsenziyasi
                                        </p>
                                        <p className="text-xs text-blue-600 mt-2">🔒 HttpOnly + Secure bayraqlar bilan himoyalangan</p>
                                    </div>
                                    <div className="bg-white rounded px-4 py-3 border border-blue-200">
                                        <p className="font-semibold text-gray-900 text-sm mb-1">refreshToken</p>
                                        <p className="text-gray-600 text-sm">
                                            7 kunga saqlangan hisobga qayta kirish kalit
                                        </p>
                                        <p className="text-xs text-blue-600 mt-2">🔒 HttpOnly + Secure bayraqlar bilan himoyalangan</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-3 italic">
                                    ℹ️ Bu cookie fayllar sizning hisobingizni xavfsiz saqlash uchun zarur. Bularning biri yo'q bo'lsa, siz saytda kirish tiyiladi.
                                </p>
                            </div>

                            {/* Legal Info */}
                            <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                                <p className="text-gray-700 text-sm">
                                    Batafsil ma'lumot uchun <a href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">Maxfiylik Siyosati</a> va <a href="/terms" className="text-blue-600 hover:underline font-semibold">Foydalanish Shartlari</a> ga qarang.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer - Sticky Action Buttons */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex flex-wrap gap-3 rounded-b-2xl">
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-base"
                            >
                                ✅ Hammasi Qabul Qil
                            </button>

                            <button
                                onClick={handleRejectAll}
                                className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-400 transition text-base"
                            >
                                ❌ Zaruriy Tashlab Qol
                            </button>

                            <button
                                onClick={handleSavePreferences}
                                className="flex-1 px-6 py-3 bg-white text-gray-900 font-bold border-2 border-gray-400 rounded-lg hover:bg-gray-100 transition text-base"
                            >
                                💾 Mening Tanlovim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
