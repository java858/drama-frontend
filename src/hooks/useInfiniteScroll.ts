import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    threshold?: number;
}

export const useInfiniteScroll = ({
    onLoadMore,
    hasMore,
    loading,
    threshold = 200,
}: UseInfiniteScrollOptions) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const rect = sentinel.getBoundingClientRect();
        if (rect.top <= window.innerHeight + threshold) {
            onLoadMore();
        }
    }, [onLoadMore, hasMore, loading, threshold]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return sentinelRef;
};