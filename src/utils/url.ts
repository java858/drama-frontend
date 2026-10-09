export const BACKEND_URL = 'http://localhost:8080';

export const getFullUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BACKEND_URL}${path}`;
    return `${BACKEND_URL}/${path}`;
};