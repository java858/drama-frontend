import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getHistory } from '../../api/user';
import { getEpisode } from '../../api/episode';
import { getDramaDetail } from '../../api/drama';
import styles from './index.module.css';

interface HistoryItem {
    id: number;
    episodeId: number;
    episodeTitle: string;
    dramaTitle: string;
    dramaId: number;
    watchedAt: string;
}

const History: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawHistory = await getHistory();
                const items: HistoryItem[] = [];
                for (const h of rawHistory) {
                    try {
                        const episode = await getEpisode(h.episodeId);
                        const drama = await getDramaDetail(episode.dramaId);
                        const lang = i18n.language;
                        let dramaTitle = drama.drama.titleZh;
                        if (lang === 'en') dramaTitle = drama.drama.titleEn || dramaTitle;
                        if (lang === 'lo') dramaTitle = drama.drama.titleLo || dramaTitle;

                        items.push({
                            id: h.id,
                            episodeId: h.episodeId,
                            episodeTitle: episode.title || `${t('drama.episode')}${episode.episodeNo}${t('drama.episodeUnit')}`,
                            dramaTitle: dramaTitle,
                            dramaId: drama.drama.id,
                            watchedAt: h.watchedAt,
                        });
                    } catch (e) {
                        console.error('Failed to fetch episode detail:', e);
                    }
                }
                setHistory(items);
            } catch (error) {
                console.error('Failed to fetch history:', error);
                setLoadFailed(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [t, i18n.language]);

    const handlePlay = (episodeId: number) => {
        navigate(`/player/${episodeId}`);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.historyPage}>
            <h1 className={styles.title}>{t('history.title')}</h1>
            {loadFailed ? (
                <div className={styles.empty}>{t('history.loadFailed')}</div>
            ) : history.length === 0 ? (
                <div className={styles.empty}>{t('history.empty')}</div>
            ) : (
                <div className={styles.list}>
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className={styles.item}
                            onClick={() => handlePlay(item.episodeId)}
                        >
                            <div className={styles.itemInfo}>
                                <h3 className={styles.dramaTitle}>{item.dramaTitle}</h3>
                                <p className={styles.episodeTitle}>{item.episodeTitle}</p>
                            </div>
                            <span className={styles.time}>
                                {new Date(item.watchedAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;