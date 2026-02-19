import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PrivacyPolicy() {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const sections = [
        {
            id: 'intro',
            title: 'Kirish',
            content: `TechStore ("Biz", "Bizning", "Kompaniya") foydalanuvchilaringizning maxfiyligini muhim deb hisoblaymiz. Bu Maxfiylik Siyosati bizning veb-saytida (techstore.uz) qanday ma'lumot to'playmiz, ishlatamiz va himoya qilamizni tushuntiradi.`
        },
        {
            id: 'collection',
            title: "Biz Qanday Ma'lumot To'playmiz?",
            content: `Biz quyidagi ma'lumotlarni to'playmiz:

1. Hisob Ma'lumotlari: Ismingiz, emailingiz, telefon raqamingiz, parolingiz (kriptlangan)

2. Xarid Ma'lumotlari: Tovarlarni ko'rish tarixingiz, savdolaringiz, to'lov usullaringiz

3. Avtomatik Ma'lumotlar: IP-manzilingiz, brauzer turi, operatsion tizim, cookie fayllar

4. Aloqa Ma'lumotlari: Agar siz bizga xabar jo'natsangiz, xabar tarkibidagi ma'lumotlar`
        },
        {
            id: 'cookies',
            title: 'Cookie Fayllar',
            content: `Biz quyidagi turdagi cookie fayllardan foydalanamiz:

• Zarur Cookie Fayllar: Saytni ishlashini ta'minlash uchun (autentifikatsiya, xavfsizlik)

• Tahlil Cookie Fayllar: Google Analytics orqali foydalanuvchilar tajribasini yaxshilash

• Marketing Cookie Fayllar: Facebook Pixel va Google Ads orqali reklama kampaniyalari

Siz cookie fayllarini o'chirib qo'yishingiz mumkin, ammo bu sayt xizmatlarining to'liq ishlamasligiga olib kelishi mumkin.`
        },
        {
            id: 'usage',
            title: "Biz Ma'lumotlarni Qanday Ishlatamiz?",
            content: `Biz ma'lumotlarni quyidagi maqsadlarda ishlatamiz:

• Hisob yaratish va boshqarish
• Buyurtmalarni qayta ishlash
• To'lovlarni amalga oshirish
• Xavfsizlik va firibgarlikdan himoya
• Saytni yaxshilash va tahlil
• Xat-xabarlar yuborish
• Foydalanuvchi xizmatiga javob berish`
        },
        {
            id: 'security',
            title: 'Xavfsizlik',
            content: `Biz sizning ma'lumotingizni quyidagi usullar bilan himoya qilamiz:

• HTTPS shifrlash: Barcha aloqalar shifrlangan

• HttpOnly Cookie Fayllar: JavaScript orqali cookie'larga to'g'ridan-to'g'ri kirish cheklangan

• Secure flag: Cookie fayllar faqat HTTPS orqali yuboriladi

• JWT tokenlar: Xavfsiz autentifikatsiya uchun ishlatiladi

Ammo hech qanday tizim 100% xavfsiz emas. Agar xavfsizlik bilan bog'liq muammo sezsangiz, iltimos bizga xabar bering.`
        },
        {
            id: 'retention',
            title: "Ma'lumotlarni Saqlash Muddati",
            content: `Biz ma'lumotlarni quyidagicha saqlaymiz:

• Hisob Ma'lumotlari: Hisobingiz aktiv bo'lgan vaqt + 1 yil

• Xarid Ma'lumotlari: Xaridlar uchun maksimal 7 yil (qonun talablariga muvofiq)

• Tahlil Ma'lumotlari: 26 oygacha

• Cookie Fayllar: Aksariyat cookie'lar 365 kungacha, ba'zilari esa sessiya davomida

Siz istalgan vaqtda o'zingizning ma'lumotingizni o'chirishni yoki yangilashni talab qilishingiz mumkin.`
        },
        {
            id: 'rights',
            title: "Sizning Huquqlaringiz",
            content: `Sizda quyidagi huquqlar mavjud:

• Ma'lumotni ko'rish va yuklab olish
• Ma'lumotni to'g'rilash
• Ma'lumotni o'chirish
• Qayta ishlashga e'tiroz bildirish
• Marketing xabarlardan voz kechish

Bu huquqlarni amalga oshirish uchun support@techstore.uz ga murojaat qiling.`
        },
        {
            id: 'third-party',
            title: 'Uchinchi Tomonlar',
            content: `Biz ba'zi xizmatlarni uchinchi tomon provayderlar orqali taqdim etamiz. Ular quyidagilarni o'z ichiga olishi mumkin:

• Google Analytics: Foydalanuvchi tahlili
• Facebook Pixel: Reklama kampaniyalari
• Google Ads: Reklama xizmatlari
• To'lov operatorlari: Pul o'tkazmalari uchun
• Email provayderlari: Xabarlarni yuborish uchun

Uchinchi tomonlar o'zlarining maxfiylik siyosatiga ega bo'lishi mumkin va ular bilan alohida shartlar amal qiladi.`
        },
        {
            id: 'contact',
            title: "Bizga Aloqada Bo'lish",
            content: `Agar sizda maxfiylik bo'yicha savollar bo'lsa, iltimos biz bilan bog'laning:

Email: support@techstore.uz
Telefon: +998 90 123 45 67
Veb-sayt: https://www.techstore.uz
Manzil: Toshkent shahar, Mirabad tumani

Biz odatda 24 soat ichida javob beramiz.`
        }
    ];

    return (
        <div className="min-h-screen bg-dark-base text-text-primary py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Maxfiylik Siyosati</h1>
                    <p className="text-text-secondary text-lg">
                        Oxirgi yangilash: {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Intro Box */}
                <div className="bg-dark-card border-l-4 border-primary rounded-lg p-6 mb-8">
                    <p className="text-text-secondary leading-relaxed">
                        Bu Maxfiylik Siyosati va xizmatlar shartlari bilan birgalikda o'qilishi kerak. Agar siz shartlarning biron bir qismiga rozi bo'lmasangiz, iltimos saytdan foydalanishni to'xtating.
                    </p>
                </div>

                {/* Accordion Sections */}
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-dark-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition"
                        >
                            {/* Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-6 hover:bg-dark-secondary/50 transition"
                            >
                                <h2 className="text-xl font-bold text-text-primary text-left">{section.title}</h2>
                                {expandedSections[section.id] ? (
                                    <ChevronUp size={24} className="text-primary flex-shrink-0 ml-4" />
                                ) : (
                                    <ChevronDown size={24} className="text-primary flex-shrink-0 ml-4" />
                                )}
                            </button>

                            {/* Content */}
                            {expandedSections[section.id] && (
                                <div className="border-t border-primary/20 px-6 py-4 bg-dark-base/50">
                                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                        {section.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-12 p-6 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Bu Maxfiylik Siyosati istalgan vaqtda o'zgartirilishi mumkin. Muhim o'zgarishlar haqida sizga email orqali xabardor qilamiz. Saytdan foydalanishni davom ettirish orqali siz yangilangan versiyani qabul qilgan deb hisoblanasiz.
                    </p>
                </div>
            </div>
        </div>
    );
}
