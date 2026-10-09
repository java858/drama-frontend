import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '../../api/error';
import { useAuthStore } from '../../stores';
import styles from './index.module.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { login, register } = useAuthStore();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleModeSwitch = (loginMode: boolean) => {
        setError(null);
        setIsLoginMode(loginMode);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLoginMode) {
                await login({
                    username: formData.username,
                    password: formData.password,
                });
                navigate('/');
            } else {
                await register({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                });
                setIsLoginMode(true);
                setFormData({ username: '', password: '', email: '' });
                alert(t('login.registerSuccess'));
            }
        } catch (err: unknown) {
            setError(getApiErrorMessage(err) || (isLoginMode ? t('login.loginFailed') : t('login.registerFailed')));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isLoginMode ? t('login.title') : t('login.registerTitle')}
                </h1>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>{t('login.username')}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder={t('login.usernamePlaceholder')}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>{t('login.password')}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder={t('login.passwordPlaceholder')}
                        />
                    </div>

                    {!isLoginMode && (
                        <div className={styles.field}>
                            <label>{t('login.email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder={t('login.emailPlaceholder')}
                            />
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? t('login.loading') : (isLoginMode ? t('login.submit') : t('login.registerSubmit'))}
                    </button>
                </form>

                <div className={styles.switchMode}>
                    {isLoginMode ? (
                        <p>
                            {t('login.noAccount')}{' '}
                            <button onClick={() => handleModeSwitch(false)} className={styles.switchBtn}>
                                {t('login.signUp')}
                            </button>
                        </p>
                    ) : (
                        <p>
                            {t('login.hasAccount')}{' '}
                            <button onClick={() => handleModeSwitch(true)} className={styles.switchBtn}>
                                {t('login.goLogin')}
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;