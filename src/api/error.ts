export const getApiErrorMessage = (error: unknown): string | undefined => {
    if (typeof error !== 'object' || error === null || !('response' in error)) {
        return undefined;
    }

    const response = error.response;
    if (typeof response !== 'object' || response === null || !('data' in response)) {
        return undefined;
    }

    const data = response.data;
    if (typeof data !== 'object' || data === null || !('message' in data)) {
        return undefined;
    }

    return typeof data.message === 'string' ? data.message : undefined;
};
