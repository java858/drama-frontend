import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.text}>
                    &copy; {year} Drama Platform. {t('footer.rights') || 'All rights reserved.'}
                </p>
            </div>
        </footer>
    );
};

export default Footer;