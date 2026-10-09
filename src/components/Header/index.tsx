import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from '../LanguageDropdown';
import GoldBalance from '../GoldBalance';
import { useAuthStore } from '../../stores';
import styles from './index.module.css';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuthStore();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    🎬 Drama Platform
                </Link>

                <nav className={styles.nav}>
                    <Link to="/">{t('nav.home')}</Link>
                    <Link to="/search">{t('nav.search')}</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/favorites">{t('nav.favorites')}</Link>
                            <Link to="/history">{t('nav.history')}</Link>
                            <Link to="/profile">{t('nav.profile')}</Link>
                            <GoldBalance />
                        </>
                    )}
                    <LanguageDropdown />
                    {!isAuthenticated && (
                        <Link to="/login" className={styles.loginBtn}>
                            {t('nav.login')}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;