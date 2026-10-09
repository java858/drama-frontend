import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '../../api/error';
import { getProfile, updateProfile } from '../../api/user';
import { getBalance } from '../../api/gold';
import type { User } from '../../types/user';
import styles from './index.module.css';
import { useAuthStore } from '../../stores';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<User | null>(null);
    const [gold, setGold] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: '' });
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, balanceData] = await Promise.all([
                    getProfile(),
                    getBalance(),
                ]);
                setProfile(userData);
                setGold(balanceData.gold);
                setFormData({ email: userData.email || '' });
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm(t('profile.confirmSaveEmail'))) {
            return;
        }

        setError(null);
        setSaving(true);
        try {
            const updated = await updateProfile({ email: formData.email.trim() });
            setProfile(updated);
            setEditing(false);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err) || t('profile.updateFailed'));
        } finally {
            setSaving(false);
        }
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!profile) {
        return <div className={styles.error}>{t('profile.notFound')}</div>;
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('profile.title')}</h1>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>{t('profile.username')}</span>
                        <span className={styles.value}>{profile.username}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.label}>{t('profile.gold')}</span>
                        <span className={styles.goldValue}>💰 {gold}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.label}>{t('profile.email')}</span>
                        {editing ? (
                            <form onSubmit={handleSubmit} className={styles.editForm}>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ email: e.target.value })}
                                    className={styles.editInput}
                                    required
                                />
                                <button type="submit" className={styles.saveBtn} disabled={saving}>
                                    {saving ? t('login.loading') : t('profile.save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ email: profile.email || '' });
                                        setEditing(false);
                                        setError(null);
                                    }}
                                    className={styles.cancelBtn}
                                >
                                    {t('profile.cancel')}
                                </button>
                            </form>
                        ) : (
                            <div className={styles.emailDisplay}>
                                <span className={styles.value}>{profile.email || '-'}</span>
                                <button
                                    onClick={() => {
                                        setFormData({ email: profile.email || '' });
                                        setEditing(true);
                                        setError(null);
                                    }}
                                    className={styles.editBtn}
                                >
                                    {t('profile.edit')}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.label}>{t('profile.joined')}</span>
                        <span className={styles.value}>
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className={styles.logoutSection}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            {t('nav.logout')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;