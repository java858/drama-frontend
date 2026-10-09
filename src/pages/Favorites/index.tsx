import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFavorites, getPurchasedDramaIds } from '../../api/user';
import { getDramaDetail } from '../../api/drama';
import DramaCard from '../../components/DramaCard';
import type { Drama } from '../../types/drama';
import styles from './index.module.css';

type ListType = 'favorites' | 'purchased';

const Favorites: React.FC = () => {
    const { t } = useTranslation();
    const [listType, setListType] = useState<ListType>('favorites');
    const [favorites, setFavorites] = useState<Drama[] | null>(null);
    const [purchased, setPurchased] = useState<Drama[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const dramas = listType === 'favorites' ? favorites : purchased;

    useEffect(() => {
        let cancelled = false;
        const cachedDramas = listType === 'favorites' ? favorites : purchased;

        if (cachedDramas !== null) {
            return;
        }

        const fetchData = async () => {
            try {
                const ids = listType === 'favorites'
                    ? await getFavorites()
                    : await getPurchasedDramaIds();
                const dramaPromises = ids.map(id => getDramaDetail(id));
                const dramaData = await Promise.all(dramaPromises);
                const loadedDramas = dramaData.map(d => d.drama);

                if (!cancelled) {
                    if (listType === 'favorites') {
                        setFavorites(loadedDramas);
                    } else {
                        setPurchased(loadedDramas);
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(`Failed to fetch ${listType}:`, error);
                    setLoadFailed(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        void fetchData();

        return () => {
            cancelled = true;
        };
    }, [favorites, listType, purchased]);

    return (
        <div className={styles.favoritesPage}>
            <h1 className={styles.title}>{t('favorites.title')}</h1>
            <div className={styles.listSelector} role="group" aria-label={t('favorites.selectType')}>
                <button
                    type="button"
                    aria-pressed={listType === 'favorites'}
                    className={`${styles.listTab} ${listType === 'favorites' ? styles.activeTab : ''}`}
                    onClick={() => {
                        setListType('favorites');
                        setLoading(favorites === null);
                        setLoadFailed(false);
                    }}
                >
                    {t('favorites.favoritesOption')}
                </button>
                <button
                    type="button"
                    aria-pressed={listType === 'purchased'}
                    className={`${styles.listTab} ${listType === 'purchased' ? styles.activeTab : ''}`}
                    onClick={() => {
                        setListType('purchased');
                        setLoading(purchased === null);
                        setLoadFailed(false);
                    }}
                >
                    {t('favorites.purchasedOption')}
                </button>
            </div>
            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                </div>
            ) : loadFailed ? (
                <div className={styles.empty}>{t('favorites.loadFailed')}</div>
            ) : dramas?.length === 0 ? (
                <div className={styles.empty}>
                    {listType === 'favorites' ? t('favorites.empty') : t('favorites.emptyPurchased')}
                </div>
            ) : (
                <div className={styles.grid}>
                    {dramas?.map((drama) => (
                        <DramaCard key={drama.id} drama={drama} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;