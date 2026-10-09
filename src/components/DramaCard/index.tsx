import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Drama } from '../../types/drama';
import styles from './index.module.css';
import { getFullUrl } from '../../utils/url';

interface DramaCardProps {
    drama: Drama;
}

const DramaCard: React.FC<DramaCardProps> = ({ drama }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const getTitle = () => {
        const lang = i18n.language;
        if (lang === 'en') return drama.titleEn || drama.titleZh;
        if (lang === 'lo') return drama.titleLo || drama.titleZh;
        return drama.titleZh;
    };

    const getDesc = () => {
        const lang = i18n.language;
        if (lang === 'en') return drama.descEn || drama.descZh;
        if (lang === 'lo') return drama.descLo || drama.descZh;
        return drama.descZh;
    };

    return (
        <div className={styles.card} onClick={() => navigate(`/drama/${drama.id}`)}>
            <div className={styles.cover}>
                {drama.coverUrl ? (
                    <img src={getFullUrl(drama.coverUrl)} alt={getTitle()} />
                ) : (
                    <div className={styles.placeholder}>🎬</div>
                )}
                <div className={styles.badge}>
                    {drama.freeEpisodes > 0 && (
                        <span className={styles.freeBadge}>
                            {t('drama.free', { count: drama.freeEpisodes })}
                        </span>
                    )}
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{getTitle()}</h3>
                <p className={styles.desc}>{getDesc()?.slice(0, 50)}...</p>
                <div className={styles.footer}>
                    <span className={styles.price}>
                        {drama.price > 0 ? t('drama.price', { price: drama.price }) : '免费'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DramaCard;