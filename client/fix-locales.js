import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Users/yoqub/OneDrive/Desktop/TechStore/client/src/locales';

function fixLocale(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        let data = JSON.parse(content);

        if (data.products && data.products.auth) {
            const productsObj = data.products.products; // the actual products data
            const wrapped = { ...data.products };
            delete wrapped.products;

            // remove the faulty products container
            delete data.products;

            // assign back the unwrapped objects
            Object.assign(data, wrapped);

            // assign the real products back
            if (productsObj) {
                data.products = productsObj;
            }
        }

        // Add missing keys
        if (data.cookies) {
            if (!data.cookies.banner.settingsButton) {
                data.cookies.banner.settingsButton = filepath.includes('uz.json') ? "Cookie Sozlamalari" :
                    (filepath.includes('ru.json') ? "Настройки Cookie" : "Cookie Settings");
            }
            if (data.cookies.modal.analytics) {
                data.cookies.modal.analytics.providerLabel = filepath.includes('uz.json') ? "Provayder" : (filepath.includes('ru.json') ? "Провайдер" : "Provider");
                data.cookies.modal.analytics.providerName = "Google Analytics";
                data.cookies.modal.analytics.purposeLabel = filepath.includes('uz.json') ? "Maqsad" : (filepath.includes('ru.json') ? "Цель" : "Purpose");
                data.cookies.modal.analytics.purpose = filepath.includes('uz.json') ? "Sayt yaxshilash" : (filepath.includes('ru.json') ? "Улучшение сайта" : "Site improvement");
            }
            if (data.cookies.modal.functional) {
                data.cookies.modal.functional.label = filepath.includes('uz.json') ? "ZARUR" : (filepath.includes('ru.json') ? "ТРЕБУЕТСЯ" : "REQUIRED");
            }
        }

        // Rewrite with 4 spaces to match current files
        fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
        console.log(`Fixed ${filepath}`);
    } catch (error) {
        console.error(`Error processing ${filepath}:`, error.message);
    }
}

['en.json', 'ru.json', 'uz.json'].forEach(f => {
    fixLocale(path.join(localesDir, f));
});
