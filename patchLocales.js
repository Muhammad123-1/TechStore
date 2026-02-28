const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client/src/locales');
const files = ['en.json', 'uz.json', 'ru.json'];

const faqEn = {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our products, services, and policies.",
    contactPrompt: "Still have questions?",
    contactUs: "Contact Us",
    items: [
        { question: "How long does delivery take?", answer: "Standard delivery takes 2-3 business days within Tashkent. Express delivery is available for next-day service. Orders can also be picked up from our showroom." },
        { question: "What is your warranty policy?", answer: "All products come with manufacturer warranty ranging from 1-5 years depending on the product. We also provide after-sales support and can assist with warranty claims." },
        { question: "Can I return or exchange a product?", answer: "Yes, we accept returns within 14 days of purchase if the product is unused and in original packaging. Exchanges can be made within 30 days. Please contact us for the return/exchange process." },
        { question: "What payment methods do you accept?", answer: "We accept cash on delivery, credit/debit cards, and online payment methods. Payment can be made at the time of delivery or in our showroom." },
        { question: "How can I track my order?", answer: "After placing an order, you can track it from your profile page. You will also receive email notifications about your order status updates." },
        { question: "Do you build custom PCs?", answer: "Yes! We offer custom PC building services. Choose your components and our experts will assemble and test your system before delivery." },
        { question: "Are all products genuine?", answer: "Absolutely! We only sell 100% authentic products from authorized distributors and manufacturers. All products come with proper documentation and warranty." },
        { question: "Do you offer installation services?", answer: "Yes, we provide installation and setup services for certain products. Contact us for more details about available services and pricing." },
        { question: "How do I create an account?", answer: "Click on 'Sign Up' in the top right corner, fill in your details, and verify your email. An account helps you track orders, save wishlists, and get faster checkout." },
        { question: "What if I receive a damaged product?", answer: "If you receive a damaged product, please contact us immediately with photos. We will arrange for a replacement or full refund at no additional cost to you." }
    ]
};

const faqUz = {
    title: "Ko'p Beriladigan Savollar",
    subtitle: "Mahsulotlarimiz, xizmatlarimiz va qoidalarimiz haqida ko'p beriladigan savollarga javob toping.",
    contactPrompt: "Yana savollaringiz bormi?",
    contactUs: "Biz bilan bog'laning",
    items: [
        { question: "Yetkazib berish qancha vaqt oladi?", answer: "Standart yetkazib berish Toshkent bo'ylab 2-3 ish kunini tashkil etadi. Tezkor yetkazib berish ertangi kun xizmati uchun mavjud. Shuningdek, buyurtmalarni bizning ko'rgazma zalimizdan olib ketishingiz mumkin." },
        { question: "Sizning kafolat siyosatingiz qanday?", answer: "Barcha mahsulotlar mahsulotga qarab 1-5 yillik ishlab chiqaruvchi kafolati bilan keladi. Shuningdek, biz sotuvdan keyingi yordam ko'rsatamiz va kafolat talablariga yordam bera olamiz." },
        { question: "Mahsulotni qaytarib bera olamanmi yoki almashtira olamanmi?", answer: "Ha, agar mahsulot ishlatilmagan va asl o'ramida bo'lsa, xarid qilingan kundan boshlab 14 kun ichida qaytarishni qabul qilamiz. Almashtirishlar 30 kun ichida amalga oshirilishi mumkin. Qaytarish/almashtirish jarayoni uchun biz bilan bog'laning." },
        { question: "Qanday to'lov usullarini qabul qilasiz?", answer: "Biz yetkazib berilganda naqd pul, kredit/debit kartalari va onlayn to'lov usullarini qabul qilamiz. To'lov yetkazib berish vaqtida yoki ko'rgazma zalimizda amalga oshirilishi mumkin." },
        { question: "Buyurtmamni qanday kuzatib borishim mumkin?", answer: "Buyurtma bergandan so'ng, uni profil sahifangizdan kuzatib borishingiz mumkin. Shuningdek, buyurtma holati yangilanishlari haqida elektron pochta xabarnomalarini olasiz." },
        { question: "Siz maxsus shaxsiy kompyuterlar yigasizmi?", answer: "Ha! Biz maxsus shaxsiy kompyuter yaratish xizmatlarini taklif etamiz. O'z tarkibiy qismlaringizni tanlang va bizning mutaxassislarimiz yetkazib berishdan oldin tizimingizni yig'adi va sinovdan o'tkazadi." },
        { question: "Barcha mahsulotlar aslmi?", answer: "Mutlaqo! Biz faqat vakolatli distribyutorlar va ishlab chiqaruvchilarning 100% original mahsulotlarini sotamiz. Barcha mahsulotlar tegishli hujjatlar va kafolatlar bilan birga keladi." },
        { question: "O'rnatish xizmatlarini taklif qilasizmi?", answer: "Ha, biz ba'zi mahsulotlarni o'rnatish va sozlash xizmatlarini taqdim etamiz. Mavjud xizmatlar va narxlar haqida batafsil ma'lumot olish uchun biz bilan bog'laning." },
        { question: "Qanday qilib hisob yaratishim mumkin?", answer: "Yuqori o'ng burchakdagi 'Ro'yxatdan O'tish' tugmasini bosing, ma'lumotlaringizni to'ldiring va elektron pochtangizni tasdiqlang. Hisob buyurtmalarni kuzatish, istaklar ro'yxatini saqlash va tezroq to'lovni amalga oshirishga yordam beradi." },
        { question: "Agar men shikastlangan mahsulotni olsam nima bo'ladi?", answer: "Agar siz shikastlangan mahsulotni olsangiz, iltimos, fotosuratlar bilan darhol biz bilan bog'laning. Biz siz uchun qo'shimcha xarajatlarsiz almashtirish yoki to'liq qaytarishni tashkil qilamiz." }
    ]
};

const faqRu = {
    title: "Часто Задаваемые Вопросы",
    subtitle: "Найдите ответы на общие вопросы о наших продуктах, услугах и политиках.",
    contactPrompt: "Остались вопросы?",
    contactUs: "Свяжитесь с нами",
    items: [
        { question: "Сколько времени занимает доставка?", answer: "Стандартная доставка занимает 2-3 рабочих дня по Ташкенту. Доступна экспресс-доставка на следующий день. Заказы также можно забрать из нашего шоурума." },
        { question: "Какая у вас гарантийная политика?", answer: "Все продукты поставляются с гарантией производителя от 1 до 5 лет в зависимости от продукта. Мы также предоставляем послепродажную поддержку и можем помочь с гарантийными претензиями." },
        { question: "Могу ли я вернуть или обменять товар?", answer: "Да, мы принимаем возвраты в течение 14 дней после покупки, если продукт не использовался и находится в original оригинальной упаковке. Обмен может быть осуществлен в течение 30 дней. Пожалуйста, свяжитесь с нами для процесса возврата/обмена." },
        { question: "Какие способы оплаты вы принимаете?", answer: "Мы принимаем наличные при доставке, кредитные/дебетовые карты и онлайн способы оплаты. Оплата может быть произведена во время доставки или в нашем шоуруме." },
        { question: "Как я могу отследить свой заказ?", answer: "После оформления заказа вы можете отследить его на странице своего профиля. Вы также будете получать уведомления по электронной почте об обновлениях статуса вашего заказа." },
        { question: "Вы собираете кастомные ПК?", answer: "Да! Мы предлагаем услуги сборки ПК на заказ. Выберите компоненты, и наши специалисты соберут и протестируют вашу систему перед доставкой." },
        { question: "Все ли товары оригинальные?", answer: "Абсолютно! Мы продаем только 100% оригинальную продукцию от авторизованных дистрибьюторов и производителей. Вся продукция поставляется с соответствующей документацией и гарантией." },
        { question: "Предоставляете ли вы услуги по установке?", answer: "Да, мы предоставляем услуги по установке и настройке для некоторых продуктов. Свяжитесь с нами для получения подробной информации о доступных услугах и ценах." },
        { question: "Как создать аккаунт?", answer: "Нажмите 'Регистрация' в правом верхнем углу, заполните свои данные и подтвердите электронную почту. Учетная запись помогает отслеживать заказы, сохранять списки желаний и быстрее оформлять заказы." },
        { question: "Что если я получу поврежденный товар?", answer: "Если вы получили поврежденный товар, пожалуйста, немедленно свяжитесь с нами с фотографиями. Мы организуем замену или полный возврат средств без дополнительных затрат для вас." }
    ]
};

const catUz = { "gaming": "O'yinlar", "office": "Ofis", "audio": "Audio", "streaming": "Striming", "apple": "Apple", "asus": "Asus" };
const catRu = { "gaming": "Игровые", "office": "Офис", "audio": "Аудио", "streaming": "Стриминг", "apple": "Apple", "asus": "Asus" };

const faqs = { en: faqEn, uz: faqUz, ru: faqRu };
const cats = { uz: catUz, ru: catRu };
const itemsTranslations = { en: 'items', uz: 'ta', ru: 'шт' };

files.forEach(file => {
    const lang = file.split('.')[0];
    const fp = path.join(dir, file);
    try {
        const content = JSON.parse(fs.readFileSync(fp, 'utf8'));

        // Inject FAQ
        content.faq = faqs[lang];

        // Inject common.items
        if (!content.common) content.common = {};
        content.common.items = itemsTranslations[lang];

        // Inject categories if missing (UZ and RU)
        if (lang !== 'en') {
            if (!content.categories) content.categories = { names: {} };
            if (!content.categories.names || Object.keys(content.categories.names).length === 0) {
                content.categories.names = cats[lang];
            }
        }

        fs.writeFileSync(fp, JSON.stringify(content, null, 4));
        console.log("Successfully patched " + file);
    } catch (e) {
        console.error("Failed to patch " + file + ":", e);
    }
});
