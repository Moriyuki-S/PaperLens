const URL_PREFIX = 'https://';

const splitUrlTail = (value: string) => {
    const match = value.match(/^[^?#]*/);
    const base = match ? match[0] : value;
    const tail = value.slice(base.length);
    return { base, tail };
};

export const normalizePdfUrlInput = (value: string) => {
    let normalized = value.trim();
    if (!normalized) {
        return '';
    }

    if (normalized.startsWith(URL_PREFIX)) {
        normalized = normalized.slice(URL_PREFIX.length);
    } else if (normalized.startsWith('http://')) {
        normalized = normalized.slice('http://'.length);
    }

    const { base, tail } = splitUrlTail(normalized);
    const cleanedBase = base.replace(/\/+$/, '');

    return `${cleanedBase}${tail}`;
};

export const buildPdfUrl = (value: string) => {
    const normalized = normalizePdfUrlInput(value);
    if (!normalized) {
        return '';
    }
    const { base, tail } = splitUrlTail(normalized);
    const cleanedBase = base.replace(/\/+$/, '');
    return `${URL_PREFIX}${cleanedBase}${tail}`;
};
