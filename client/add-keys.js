import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Users/yoqub/OneDrive/Desktop/TechStore/client/src/locales';

function addKeys(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        let data = JSON.parse(content);

        const isUz = filepath.includes('uz.json');
        const isRu = filepath.includes('ru.json');

        // Add Slides
        if (data.home && data.home.hero && data.home.hero.slides) {
            data.home.hero.slides['2'] = {
                title: isUz ? "Keng Qamrovli Tanlov" : (isRu ? "Широкий Выбор Ассортимента" : "Extensive Product Range"),
                subtitle: isUz ? "Dunyodagi eng yetakchi brendlar" : (isRu ? "Ведущие мировые бренды" : "Leading global brands")
            };
            data.home.hero.slides['3'] = {
                title: isUz ? "Yangi Avlod Qurilmalari" : (isRu ? "Устройства Нового Поколения" : "Next-Gen Devices"),
                subtitle: isUz ? "Kechikmang, hoziroq xarid qiling" : (isRu ? "Не откладывайте, покупайте сейчас" : "Don't delay, buy now")
            };
            data.home.hero.slides['4'] = {
                title: isUz ? "Tezkor Va Ishonchli" : (isRu ? "Быстро И Надежно" : "Fast And Reliable"),
                subtitle: isUz ? "O'zbekiston bo'ylab yetkazib berish" : (isRu ? "Доставка по всему Узбекистану" : "Delivery across Uzbekistan")
            };
        }

        // Add Contact Form Keys
        data.contact = {
            title: isUz ? "Biz Bilan Bog'lanish" : (isRu ? "Свяжитесь с нами" : "Contact Us"),
            sendTitle: isUz ? "Bizga Xabar Yuboring" : (isRu ? "Отправьте нам сообщение" : "Send us a Message"),
            fields: {
                name: isUz ? "Ism" : (isRu ? "Имя" : "Name"),
                email: "Email",
                subject: isUz ? "Mavzu" : (isRu ? "Тема" : "Subject"),
                message: isUz ? "Xabar" : (isRu ? "Сообщение" : "Message")
            },
            sendButton: isUz ? "Xabarni Yuborish" : (isRu ? "Отправить Сообщение" : "Send Message"),
            successMsg: isUz ? "Xabar yuborildi! Tez orada javob beramiz." : (isRu ? "Сообщение отправлено! Мы скоро ответим." : "Message sent! We will get back to you soon."),
            info: {
                emailBox: "Email",
                phoneBox: isUz ? "Telefon" : (isRu ? "Телефон" : "Phone"),
                locationBox: isUz ? "Manzil" : (isRu ? "Местоположение" : "Location"),
                locationDesc1: isUz ? "Tech Park Tumani" : (isRu ? "Район Tech Park" : "Tech Park District"),
                locationDesc2: isUz ? "Toshkent, O'zbekiston" : (isRu ? "Ташкент, Узбекистан" : "Tashkent, Uzbekistan"),
                pickupMsg: isUz ? "Ko'rgazma zali mavjud" : (isRu ? "Доступен самовывоз и шоурум" : "Showroom + Pickup Available")
            },
            workingHours: {
                title: isUz ? "Ish Vaqti" : (isRu ? "Часы работы" : "Working Hours"),
                weekdays: isUz ? "Dushanba - Shanba" : (isRu ? "Понедельник - Суббота" : "Monday - Saturday"),
                sunday: isUz ? "Yakshanba" : (isRu ? "Воскресенье" : "Sunday")
            }
        };

        fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
        console.log(`Added keys to ${filepath}`);
    } catch (err) {
        console.error(`Error on ${filepath}:`, err.message);
    }
}

['en.json', 'ru.json', 'uz.json'].forEach(f => {
    addKeys(path.join(localesDir, f));
});
