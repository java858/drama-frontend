import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getLatestDramasPaged, getHotDramas } from '../../api/drama';
import DramaCard from '../../components/DramaCard';
import HorizontalScroll from '../../components/HorizontalScroll';
import GenreFilter from '../../components/GenreFilter';
import BackToTop from '../../components/BackToTop';
import MobileHeader from '../../components/MobileHeader';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { Drama } from '../../types/drama';
import styles from './index.module.css';

const PAGE_SIZE = 20;

const Home: React.FC = () => {
    const { t } = useTranslation();

    // 热门
    const [hotDramas, setHotDramas] = useState<Drama[]>([]);
    const [hotLoading, setHotLoading] = useState(true);

    // 最新（无限滚动）
    const [latestDramas, setLatestDramas] = useState<Drama[]>([]);
    const [latestPage, setLatestPage] = useState(1);
    const [latestHasMore, setLatestHasMore] = useState(true);
    const [latestLoading, setLatestLoading] = useState(false);

    // 类型筛选
    const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

    // 加载热门
    useEffect(() => {
        const fetchHot = async () => {
            try {
                const data = await getHotDramas(10);
                setHotDramas(data);
            } catch (error) {
                console.error('Failed to fetch hot dramas:', error);
            } finally {
                setHotLoading(false);
            }
        };
        fetchHot();
    }, []);

    // 加载最新（第一页或类型变化时重新加载）
    useEffect(() => {
        setLatestDramas([]);
        setLatestPage(1);
        setLatestHasMore(true);
        loadLatest(1, selectedGenreId);
    }, [selectedGenreId]);

    const loadLatest = async (page: number, genreId: number | null) => {
        if (latestLoading) return;
        setLatestLoading(true);
        try {
            const data = await getLatestDramasPaged(page, PAGE_SIZE, genreId);
            if (page === 1) {
                setLatestDramas(data.records);
            } else {
                setLatestDramas((prev) => [...prev, ...data.records]);
            }
            setLatestHasMore(data.current < data.pages);
        } catch (error) {
            console.error('Failed to fetch latest dramas:', error);
        } finally {
            setLatestLoading(false);
        }
    };

    const loadMore = useCallback(() => {
        if (latestLoading || !latestHasMore) return;
        const nextPage = latestPage + 1;
        setLatestPage(nextPage);
        loadLatest(nextPage, selectedGenreId);
    }, [latestPage, latestHasMore, latestLoading, selectedGenreId]);

    const sentinelRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore: latestHasMore,
        loading: latestLoading,
    });

    return (
        <>
            <MobileHeader />
            <div className={styles.home}>
                {/* 热门电视剧 */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>🔥 {t('home.hot')}</h2>
                    {hotLoading ? (
                        <div className={styles.loadingRow}>加载中...</div>
                    ) : (
                        <HorizontalScroll>
                            {hotDramas.map((drama) => (
                                <div key={drama.id} className={styles.hotCardWrapper}>
                                    <DramaCard drama={drama} />
                                </div>
                            ))}
                        </HorizontalScroll>
                    )}
                </section>

                {/* 最新电视剧 */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>🆕 {t('home.latest')}</h2>
                    <GenreFilter
                        selectedGenreId={selectedGenreId}
                        onSelect={setSelectedGenreId}
                    />
                    <div className={styles.grid}>
                        {latestDramas.map((drama) => (
                            <DramaCard key={drama.id} drama={drama} />
                        ))}
                    </div>
                    <div ref={sentinelRef} className={styles.sentinel}>
                        {latestLoading && <div className={styles.loadingMore}>加载中...</div>}
                        {!latestHasMore && latestDramas.length > 0 && (
                            <div className={styles.noMore}>{t('home.noMore')}</div>
                        )}
                    </div>
                </section>

                <BackToTop />
            </div>
        </>
    );
};

export default Home;