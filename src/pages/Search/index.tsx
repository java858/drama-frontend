import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchDramas } from '../../api/drama';
import DramaCard from '../../components/DramaCard';
import BackToTop from '../../components/BackToTop';
import type { Drama } from '../../types/drama';
import styles from './index.module.css';

const Search: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const initialKeyword = searchParams.get('q') || '';

    const [keyword, setKeyword] = useState(initialKeyword);
    const [results, setResults] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const lang = i18n.language;
            const data = await searchDramas(keyword, lang);
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.searchPage}>
            <div className={styles.searchBar}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={t('search.placeholder')}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchBtn}>
                        {t('search.button')}
                    </button>
                </form>
            </div>

            <div className={styles.results}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>{t('search.loading')}</p>
                    </div>
                ) : searched ? (
                    results.length > 0 ? (
                        <>
                            <p className={styles.resultCount}>
                                {t('search.count', { count: results.length })}
                            </p>
                            <div className={styles.grid}>
                                {results.map((drama) => (
                                    <DramaCard key={drama.id} drama={drama} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.empty}>
                            <p>{t('search.empty')}</p>
                        </div>
                    )
                ) : (
                    <div className={styles.placeholder}>
                        <p>{t('search.hint')}</p>
                    </div>
                )}
            </div>
            <BackToTop />
        </div>
    );
};

export default Search;