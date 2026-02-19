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
            content: 'TechStore ("Biz", "Bizning", "Kompaniya") foydalanuvchileringizning maxfiyligini muhim deb hisoblaymiz. Bu Maxfiylik Siyosati bizning veb-saytida (techstore.uz) qanday ma\'lumot to\'playmiz, ishlatamiz va himoya qilamizni tushuntiradi.'
        },
        {
            id: 'collection',
            title: 'Biz Qanday Ma\'lumot To\'playmiz?',
            content: 'Biz quyidagi ma\'lumotlarni to\'playmiz:\n\n1. Hisob Ma\'lumotlari: Ismingiz, emailingiz, telefon raqamingiz, parolingiz (kriptlangan)\n\n2. Xarid Ma\'lumotlari: Tovarlarni ko\'rish tarixingiz, savdolaringiz, to\'lovni usullaringiz\n\n3. Avtomatik Ma\'lumotlar: IP-manzilingiz, brauzer turi, operatsion tizim, cookie fayllar\n\n4. Aloqa Ma\'lumotlari: Agar siz bizga xabar jo\'natsangiz, xabur tarkibidagi ma\'lumotlar'
        },
        {
            id: 'cookies',
            title: 'Cookie Fayllar',
            content: 'Biz quyidagi turdagi cookie fayllardan foydalanamiz:\n\n⚙️ Zarur Cookie Fayllar: Saytni ishlashini ta\'minlash uchun (autentifikatsiya, xavfsizlik)\n\n📊 Tahlil Cookie Fayllar: Google Analytics orqali foydalanuvchilar tajribasini yaxshilash\n\n📢 Marketing Cookie Fayllar: Facebook Pixel va Google Ads orqali reklama kampaniyalari\n\nSiz cookie fayllarini o\'chirib qo\'yishingiz mumkin, ammo bu sayt xizmatini qo\'llay olmashingizni ta\'minlashi mumkin.'
        },
        {
            id: 'usage',
            title: 'Biz Ma\'lumotlarni Qanday Ishlatamiz?',
            content: 'Biz ma\'lumotlarni quyidagi maqsadlarida ishlatamiz:\n\n• Hisob yaratish va boshqarish\n• Buyurtmalarni qayta ishlash\n• To\'lov ishlash\n• Xavfsizlik va fraud'dan himoya\n• Saytni yaxshilash va tahlil\n• Xat-xabarlar yuborish\n• Foydalanuvchi xizmatiga javob berish'
        },
        {
            id: 'security',
            title: 'Xavfsizlik',
            content: 'Biz sizning ma\'lumotingizni quyidagi usullari bilan himoya qilamiz:\n\n🔒 HTTPS enkriptlash: Barcha aloqalar shifrlangan\n\n🔐 HttpOnly Cookie Fayllar: JavaScript orqali foydalanuvchilar xizmatiga kirish mumkin emas\n\n🛡️ Secure Flaglar: Cookie fayllar faqat HTTPS orqali yuboriladi\n\n🔑 JWT Tokenlar: Xavfsiz autentifikatsiya uchun\n\nAmmo hech qanday veb-sayt 100% xavfsiz emas. Agar xavfsizlik muammosini bilsangiz, bizga xabar bering.'
        },
        {
            id: 'retention',
            title: 'Ma\'lumotlarni Saqlash Muddati',
            content: 'Biz ma\'lumotlarni quyidagicha saqlaymiz:\n\n📋 Hisob Ma\'lumotlari: Hisobingiz aktiv bo\'lgan vaqt + 1 yil\n\n🛒 Xarid Ma\'lumotlari: Xaridi uchun maksimal 7 yil (Qonun talabi)\n\n📊 Tahlil Ma\'lumotlari: 26 oyga qadar\n\n🍪 Cookie Fayllar: Aksariyat 365 kunga, ba\'zilar sessiyon davomida\n\nSiz istalgan vaqtda ma\'lumotni o\'chirishni so\'rashingiz mumkin.'
        },
        {
            id: 'rights',
            title: 'Sizning Huquqlaringiz',
            content: 'Sizda quyidagi huquqlar bor:\n\n• Ma\'lumotni ko\'rish va yuklab olish\n• Ma\'lumotni to\'g\'irlash\n• Ma\'lumotni o\'chirish\n• Qayta ishlashga e\'tiroz bildirishlash\n• Marketing xat-xabarlardan foydalanuvchisini butun chiqarish\n\nBu huquqlarni amalga oshirish uchun support@techstore.uz ga yozing.'
        },
        {
            id: 'third-party',
            title: 'Uchinchi Tomonlar',
            content: 'Biz ma\'lumotlarni quyidagi uchinchi tomonlarga beramiz:\n\n🔵 Google Analytics: Foydalanuvchilar tahlili\n📘 Facebook Pixel: Reklama kampaniyalari\n🔴 Google Ads: Reklama\n💳 To\'lov Operatorlari: Pul o\'tkazishlari\n📧 Email Servisilari: Xat-xabarlarni yuborish\n\nHamma hamkorlar ma\'lumotlarni maxfiy saqlashga majbur.'
        },
        {
            id: 'contact',
            title: 'Bizga Aloqada Bo\'lish',
            content: 'Agar sizda maxfiylik haqida savollaringiz bo\'lsa:\n\n📧 Email: support@techstore.uz\n📞 Telefon: +998 90 123 45 67\n🌐 Veb-sayt: www.techstore.uz\n📍 Manzil: Tashkent shahar, Mirabad tumani\n\nBiz 24 soat ichida javob beramiz.'
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
                        Bu Maxfiylik Siyosati qonun qabula olingan xizmatlarning barcha shartlari bilan birgalikda o'qilishi kerak. Agar siz biz shartlarning biron bir qismiga rozi bo'lmasangiz, iltimos, saytdan foydalanmang.
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
                        Bu Maxfiylik Siyosati istalgan vaqtda o'zgartirilishi mumkin. Muhim o'zgarishlar haqida siz email orqali xabardor qilinamiz. Saytdan foydalanishni davom ettirish orqali siz yangiz versiyasini qabul qilgan deb hisoblanasiz.
                    </p>
                </div>
            </div>
        </div>
    );
}
