import type { Episode } from "./episode";

export interface Drama {
    id: number;
    titleZh: string;
    titleEn: string;
    titleLo: string;
    descZh: string;
    descEn: string;
    descLo: string;
    coverUrl: string;
    director: string;
    cast: string;
    price: number;
    freeEpisodes: number;
    hotOrder: number;
    status: number;
    createdAt: string;
    updatedAt: string;
    genreIds?: number[];
}

export interface DramaDetailResponse {
    drama: Drama;
    episodes: Episode[];
}

export interface DramaFavPurchaseStatus {
    hasPurchased: boolean;
    hasFavorited: boolean;
}
