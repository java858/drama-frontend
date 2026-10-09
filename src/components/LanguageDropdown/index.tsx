import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const LANGUAGES = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
    { code: 'lo', label: 'ພາສາລາວ' },
];

const LanguageDropdown: React.FC = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentLang = i18n.language || 'en';

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
        setOpen(false);
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <button className={styles.trigger} onClick={() => setOpen(!open)} title="语言">
                🌐
            </button>
            {open && (
                <div className={styles.dropdown}>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles.item} ${currentLang === lang.code ? styles.active : ''}`}
                            onClick={() => handleSelect(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;