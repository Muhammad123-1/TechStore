import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = t('faq.items', { returnObjects: true });
    const faqList = Array.isArray(faqs) ? faqs : [];

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-4 text-center">{t('faq.title', 'Frequently Asked Questions')}</h1>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
                {t('faq.subtitle', 'Find answers to common questions about our products, services, and policies.')}
            </p>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqList.map((faq, index) => (
                    <div key={index} className="card overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full p-6 flex items-center justify-between hover:bg-dark-secondary transition"
                        >
                            <span className="font-semibold text-left">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="text-primary flex-shrink-0" />
                            ) : (
                                <ChevronDown className="text-primary flex-shrink-0" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-6 text-text-secondary animate-fade-in">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-text-secondary mb-4">{t('faq.contactPrompt', 'Still have questions?')}</p>
                <a href="/contact" className="btn-primary inline-block">
                    {t('faq.contactUs', 'Contact Us')}
                </a>
            </div>
        </div>
    );
}
