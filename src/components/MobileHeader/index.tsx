import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from '../LanguageDropdown';
import styles from './index.module.css';

const MobileHeader: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <div className={styles.mobileHeader}>
            <div className={styles.searchBox} onClick={handleSearchClick}>
                <span className={styles.searchIcon}>🔍</span>
                <span className={styles.searchText}>{t('search.placeholder')}</span>
            </div>
            <LanguageDropdown />
        </div>
    );
};

export default MobileHeader;