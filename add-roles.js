const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'client', 'src', 'locales');
const files = ['en.json', 'ru.json', 'uz.json'];

const keys = {
    en: {
        "nav": {
            "delivery": "Delivery Panel"
        },
        "admin": {
            "users": "Users",
            "role": "Role",
            "joined": "Joined",
            "actions": "Actions",
            "fetchError": "Failed to load data",
            "updateError": "Failed to update",
            "roleUpdated": "Role updated successfully",
            "noUsers": "No users found.",
            "editRole": "Edit Role",
            "noDeliveries": "No pending deliveries found.",
            "deliveryDesc": "Manage current deliveries",
            "roles": {
                "user": "User",
                "delivery": "Delivery",
                "assistant": "Assistant",
                "admin": "Admin"
            }
        }
    },
    ru: {
        "nav": {
            "delivery": "Панель доставки"
        },
        "admin": {
            "users": "Пользователи",
            "role": "Роль",
            "joined": "Присоединился",
            "actions": "Действия",
            "fetchError": "Не удалось загрузить данные",
            "updateError": "Ошибка обновления",
            "roleUpdated": "Роль успешно обновлена",
            "noUsers": "Пользователи не найдены.",
            "editRole": "Изменить роль",
            "noDeliveries": "Нет ожидающих доставок.",
            "deliveryDesc": "Управление текущими доставками",
            "roles": {
                "user": "Пользователь",
                "delivery": "Курьер",
                "assistant": "Ассистент",
                "admin": "Админ"
            }
        }
    },
    uz: {
        "nav": {
            "delivery": "Yetkazish paneli"
        },
        "admin": {
            "users": "Foydalanuvchilar",
            "role": "Rol",
            "joined": "Qo'shilgan",
            "actions": "Harakatlar",
            "fetchError": "Ma'lumotni yuklashda xatolik",
            "updateError": "Yangilashda xatolik",
            "roleUpdated": "Rol muvaffaqiyatli o'zgartirildi",
            "noUsers": "Foydalanuvchilar topilmadi.",
            "editRole": "Rolni tahrirlash",
            "noDeliveries": "Kutilayotgan yetkazib berishlar yo'q.",
            "deliveryDesc": "Joriy yetkazib berishlarni boshqarish",
            "roles": {
                "user": "Foydalanuvchi",
                "delivery": "Kuryer",
                "assistant": "Yordamchi",
                "admin": "Admin"
            }
        }
    }
};

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

files.forEach(file => {
    const lang = file.split('.')[0];
    const filepath = path.join(localesDir, file);
    if (fs.existsSync(filepath)) {
        let content = JSON.parse(fs.readFileSync(filepath, 'utf8'));

        content = deepMerge(content, keys[lang]);

        fs.writeFileSync(filepath, JSON.stringify(content, null, 4));
        console.log(`Updated ${file}`);
    }
});
