export const API_URL = (() => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    if (import.meta.env.DEV) {
        return `${location.protocol}//${location.hostname}:3000`;
    }

    //PROD
    return `${location.protocol}//${location.hostname}`;
})();
