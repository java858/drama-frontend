import { create } from 'zustand';
import { getAllGenres } from '../api/drama';
import type { DramaGenre } from '../types/genre';

interface GenreState {
    allGenres: DramaGenre[];
    loaded: boolean;
    fetchGenres: () => Promise<void>;
    getGenreLabel: (genreId: number, lang: string) => string;
}

export const useGenreStore = create<GenreState>((set, get) => ({
    allGenres: [],
    loaded: false,

    fetchGenres: async () => {
        try {
            const genres = await getAllGenres();
            set({ allGenres: genres, loaded: true });
        } catch (error) {
            console.error('Failed to fetch genres:', error);
        }
    },

    // 辅助方法：根据 genreId 和当前语言拿标签
    getGenreLabel: (genreId: number, lang: string): string => {
        const genre = get().allGenres.find((g) => g.id === genreId);
        if (!genre) return String(genreId);
        if (lang === 'en') return genre.labelEn || genre.labelZh;
        if (lang === 'lo') return genre.labelLo || genre.labelZh;
        return genre.labelZh;
    },
}));