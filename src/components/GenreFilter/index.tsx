import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGenreStore } from '../../stores';
import styles from './index.module.css';

interface GenreFilterProps {
    selectedGenreId: number | null;
    onSelect: (genreId: number | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenreId, onSelect }) => {
    const { i18n } = useTranslation();
    const allGenres = useGenreStore((state) => state.allGenres);

    const handleClick = (genreId: number) => {
        if (selectedGenreId === genreId) {
            onSelect(null);  // 取消选择
        } else {
            onSelect(genreId);
        }
    };

    const getLabel = (genre: typeof allGenres[0]) => {
        if (i18n.language === 'en') return genre.labelEn || genre.labelZh;
        if (i18n.language === 'lo') return genre.labelLo || genre.labelZh;
        return genre.labelZh;
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterInner}>
                {allGenres.map((genre) => (
                    <button
                        key={genre.id}
                        className={`${styles.tag} ${selectedGenreId === genre.id ? styles.active : ''}`}
                        onClick={() => handleClick(genre.id)}
                    >
                        {getLabel(genre)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenreFilter;