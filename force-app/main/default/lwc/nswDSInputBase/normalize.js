export function normalizeInput(value) {
    if (typeof value === 'number' || typeof value === 'string') {
        return String(value);
    }
    return '';
}
