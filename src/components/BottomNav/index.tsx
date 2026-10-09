import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores';
import styles from './index.module.css';

interface NavItem {
    path: string;
    label: string;
    icon: string;
    requiresAuth: boolean;
}

const BottomNav: React.FC = () => {
    const { t } = useTranslation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    const navItems: NavItem[] = [
        { path: '/', label: t('nav.home'), icon: '🏠', requiresAuth: false },
        { path: '/favorites', label: t('nav.favorites'), icon: '⭐', requiresAuth: true },
        { path: '/history', label: t('nav.history'), icon: '🕐', requiresAuth: true },
        { path: '/profile', label: t('nav.profile'), icon: '👤', requiresAuth: true },
    ];

    const handleClick = (e: React.MouseEvent, item: NavItem) => {
        if (item.requiresAuth && !isAuthenticated) {
            e.preventDefault();
            navigate('/login');
        }
    };

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={(e) => handleClick(e, item)}
                >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;