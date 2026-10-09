import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'zh', label: '中文' },
        { code: 'en', label: 'English' },
        { code: 'lo', label: 'ພາສາລາວ' },
    ];

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    const currentLang = i18n.language || 'en';

    return (
        <div className={styles.switcher}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    className={`${styles.langBtn} ${currentLang === lang.code ? styles.active : ''}`}
                    onClick={() => changeLanguage(lang.code)}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;