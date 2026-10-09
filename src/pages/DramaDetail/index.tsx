import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDramaDetail } from '../../api/drama';
import { purchaseDrama } from '../../api/gold';
import { getDramaFavPurchaseStatus, addFavorite, removeFavorite } from '../../api/user';
import { useAuthStore, useGenreStore } from '../../stores';
import type { Drama } from '../../types/drama';
import type { Episode } from '../../types/episode';
import { getFullUrl } from '../../utils/url';
import styles from './index.module.css';
import ConfirmModal from '../../components/ConfirmModal';

const DramaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const getGenreLabel = useGenreStore((state) => state.getGenreLabel);

    const [drama, setDrama] = useState<Drama | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasFavorited, setHasFavorited] = useState(false);
    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        message: string;
        onConfirm: () => void;
    }>({ open: false, message: '', onConfirm: () => { } });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // 如果登录，同时请求 detail 和 status
                if (isAuthenticated) {
                    const [detail, status] = await Promise.all([
                        getDramaDetail(Number(id)),
                        getDramaFavPurchaseStatus(Number(id)),
                    ]);
                    setDrama(detail.drama);
                    setEpisodes(detail.episodes || []);
                    setHasPurchased(status.hasPurchased);
                    setHasFavorited(status.hasFavorited);
                } else {
                    const detail = await getDramaDetail(Number(id));
                    setDrama(detail.drama);
                    setEpisodes(detail.episodes || []);
                    setHasPurchased(false);
                    setHasFavorited(false);
                }
            } catch (error) {
                console.error('Failed to fetch drama detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isAuthenticated]);

    const getTitle = () => {
        if (!drama) return '';
        const lang = i18n.language;
        if (lang === 'en') return drama.titleEn || drama.titleZh;
        if (lang === 'lo') return drama.titleLo || drama.titleZh;
        return drama.titleZh;
    };

    const getDesc = () => {
        if (!drama) return '';
        const lang = i18n.language;
        if (lang === 'en') return drama.descEn || drama.descZh;
        if (lang === 'lo') return drama.descLo || drama.descZh;
        return drama.descZh;
    };

    const doPurchase = async () => {
        if (!drama) return;
        setPurchasing(true);
        try {
            await purchaseDrama(drama.id);
            setHasPurchased(true);
            alert(t('drama.purchaseSuccess'));
        } catch (error: any) {
            alert(error.response?.data?.message || t('drama.purchaseFailed'));
        } finally {
            setPurchasing(false);
        }
    };

    const handlePurchaseClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!drama) return;

        setConfirmState({
            open: true,
            message: `${t('drama.confirmPurchase')}\n\n💰 ${drama.price}`,
            onConfirm: () => {
                setConfirmState((prev) => ({ ...prev, open: false }));
                doPurchase();
            },
        });
    };

    const handleEpisodeClick = (episode: Episode, canWatch: boolean) => {
        if (canWatch) {
            navigate(`/player/${episode.id}`);
            return;
        }
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setConfirmState({
            open: true,
            message: t('drama.confirmPurchaseFromEpisode'),
            onConfirm: () => {
                setConfirmState((prev) => ({ ...prev, open: false }));
                doPurchase();
            },
        });
    };

    const handleFavoriteToggle = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!drama) return;

        try {
            if (hasFavorited) {
                await removeFavorite(drama.id);
                setHasFavorited(false);
            } else {
                await addFavorite(drama.id);
                setHasFavorited(true);
            }
        } catch (error: any) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const isEpisodeFree = (index: number) => {
        if (!drama) return false;
        return index < drama.freeEpisodes;
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (!drama) {
        return (
            <div className={styles.notFound}>
                <p>{t('drama.notFound')}</p>
            </div>
        );
    }

    const totalEpisodes = episodes.length;

    return (
        <>
            <div className={styles.detailPage}>
                <button
                    type="button"
                    className={styles.backLink}
                    onClick={() => navigate(-1)}
                >
                    ← {t('player.back')}
                </button>
                <div className={styles.hero}>
                    <div className={styles.cover}>
                        {drama.coverUrl ? (
                            <img src={getFullUrl(drama.coverUrl)} alt={getTitle()} />
                        ) : (
                            <div className={styles.coverPlaceholder}>🎬</div>
                        )}
                    </div>
                    <div className={styles.info}>
                        <h1 className={styles.title}>{getTitle()}</h1>
                        <div className={styles.meta}>
                            <span>{t('drama.director')}: {drama.director || '-'}</span>
                            <span>{t('drama.cast')}: {drama.cast || '-'}</span>
                            <span>{t('drama.episodes')}: {totalEpisodes}</span>
                        </div>
                        {/* 类型标签 */}
                        {drama.genreIds && drama.genreIds.length > 0 && (
                            <div className={styles.genres}>
                                {drama.genreIds.map((gid) => (
                                    <span key={gid} className={styles.genreTag}>
                                        {getGenreLabel(gid, i18n.language)}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className={styles.desc}>{getDesc()}</p>
                        <div className={styles.actions}>
                            <div className={styles.price}>
                                {drama.price > 0 ? (
                                    <span className={styles.priceTag}>
                                        💰 {t('drama.price', { price: drama.price })}
                                    </span>
                                ) : (
                                    <span className={styles.freeTag}>{t('drama.freeTag')}</span>
                                )}
                            </div>
                            <button
                                className={`${styles.favoriteBtn} ${hasFavorited ? styles.favorited : ''}`}
                                onClick={handleFavoriteToggle}
                            >
                                {hasFavorited ? `❤️ ${t('drama.favorited')}` : `♡ ${t('drama.favorite')}`}
                            </button>
                            {hasPurchased ? (
                                <span className={styles.purchasedBadge}>✅ {t('drama.purchased')}</span>
                            ) : drama.price > 0 ? (
                                <button
                                    className={styles.purchaseBtn}
                                    onClick={handlePurchaseClick}
                                    disabled={purchasing || !isAuthenticated}
                                >
                                    {purchasing ? t('drama.purchasing') : t('drama.purchase')}
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className={styles.episodes}>
                    <h2 className={styles.episodesTitle}>{t('drama.episodes')}</h2>
                    <div className={styles.episodeGrid}>
                        {episodes.map((episode, index) => {
                            const isFree = isEpisodeFree(index);
                            const canWatch = isFree || hasPurchased;
                            const isGreen = isFree || hasPurchased;
                            return (
                                <div
                                    key={episode.id}
                                    className={`${styles.episodeRect} ${isGreen ? styles.green : styles.gray}`}
                                    onClick={() => handleEpisodeClick(episode, canWatch)}
                                >
                                    {isFree && !hasPurchased && (
                                        <span className={styles.freeBadge}>{t('drama.freeTag')}</span>
                                    )}
                                    <span className={styles.episodeNum}>{episode.episodeNo}</span>
                                    {!isFree && !hasPurchased && (
                                        <span className={styles.lockIcon}>🔒</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <ConfirmModal
                open={confirmState.open}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default DramaDetail;