import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEpisode, checkPlayPermission, getStreamUrl } from '../../api/episode';
import { recordWatchHistory } from '../../api/user';
import { useAuthStore } from '../../stores';
import type { Episode } from '../../types/episode';
import styles from './index.module.css';

type FullscreenVideoElement = HTMLVideoElement & {
    webkitEnterFullscreen?: () => void;
};

const Player: React.FC = () => {
    const { episodeId } = useParams<{ episodeId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const videoRef = useRef<HTMLVideoElement>(null);
    const historyRequestFor = useRef<number | null>(null);
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [canWatch, setCanWatch] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [speed, setSpeed] = useState(1);
    const fullscreenAttemptedFor = useRef<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!episodeId) return;
            try {
                const episodeData = await getEpisode(Number(episodeId));
                setEpisode(episodeData);

                const hasPermission = await checkPlayPermission(Number(episodeId));
                setCanWatch(hasPermission);

                if (!hasPermission) {
                    setError(t('player.noPermission'));
                }
            } catch {
                setError(t('player.notFound'));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [episodeId, t]);

    useEffect(() => {
        if (!episode || !canWatch || !window.matchMedia('(max-width: 768px)').matches) {
            return;
        }

        const video = videoRef.current as FullscreenVideoElement | null;
        if (!video || fullscreenAttemptedFor.current === episode.id) {
            return;
        }
        fullscreenAttemptedFor.current = episode.id;

        try {
            if (video.requestFullscreen) {
                void video.requestFullscreen().catch(() => undefined);
            } else {
                video.webkitEnterFullscreen?.();
            }
        } catch {
            // Mobile browsers can block automatic fullscreen; keep inline playback.
        }
    }, [canWatch, episode]);

    const handleSpeedChange = () => {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(speed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        setSpeed(newSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = newSpeed;
        }
    };

    const handlePlaybackStart = async () => {
        if (!isAuthenticated || !episode || historyRequestFor.current === episode.id) {
            return;
        }

        const playingEpisodeId = episode.id;
        historyRequestFor.current = playingEpisodeId;
        try {
            await recordWatchHistory(playingEpisodeId);
        } catch (requestError) {
            if (historyRequestFor.current === playingEpisodeId) {
                historyRequestFor.current = null;
            }
            console.error('Failed to record watch history:', requestError);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>{t('player.loading')}</p>
            </div>
        );
    }

    if (error || !canWatch) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    {t('player.back')}
                </button>
            </div>
        );
    }

    if (!episode) {
        return (
            <div className={styles.error}>
                <p>{t('player.notFound')}</p>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    {t('player.back')}
                </button>
            </div>
        );
    }

    const videoUrl = getStreamUrl(episode.id);

    return (
        <div className={styles.playerPage}>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className={styles.backButton}
                aria-label={t('player.back')}
            >
                <span aria-hidden="true">←</span>
                {t('player.back')}
            </button>
            <div className={styles.videoContainer}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    src={videoUrl}
                    controls
                    autoPlay
                    playsInline
                    onPlaying={handlePlaybackStart}
                    onError={() => setError(t('player.loadError') || '视频加载失败')}
                />
            </div>
            <div className={styles.info}>
                <h2 className={styles.title}>{episode.title || `${t('drama.episode')}${episode.episodeNo}${t('drama.episodeUnit')}`}</h2>
                <div className={styles.controls}>
                    <button onClick={handleSpeedChange} className={styles.controlBtn}>
                        {t('player.speed')} {speed}x
                    </button>
                    <button onClick={handleFullscreen} className={styles.controlBtn}>
                        {t('player.fullscreen')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Player;