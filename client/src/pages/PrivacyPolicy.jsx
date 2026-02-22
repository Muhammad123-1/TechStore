import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PrivacyPolicy() {
    const { t, i18n } = useTranslation();
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const sections = t('privacy.sections', { returnObjects: true }) || [];

    const localeMap = { en: 'en-US', uz: 'uz-UZ', ru: 'ru-RU' };
    const locale = localeMap[i18n.language] || 'en-US';

    return (
        <div className="min-h-screen bg-dark-base text-text-primary py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('privacy.title')}</h1>
                    <p className="text-text-secondary text-lg">
                        {t('privacy.lastUpdated')}: {new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Intro Box */}
                <div className="bg-dark-card border-l-4 border-primary rounded-lg p-6 mb-8">
                    <p className="text-text-secondary leading-relaxed">
                        {t('privacy.intro')}
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
                        {t('privacy.footerNote')}
                    </p>
                </div>
            </div>
        </div>
    );
}
