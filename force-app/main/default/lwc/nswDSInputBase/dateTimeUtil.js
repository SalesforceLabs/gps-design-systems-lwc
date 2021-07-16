import {
    normalizeISODate,
    normalizeISOTime,
    normalizeISODateTime,
    normalizeFormattedDateTime,
} from 'c/nswInternationalizationLibrary';

export function normalizeDate(value) {
    return normalizeISODate(value).isoValue || '';
}

// Converts value to the user's timezone and formats it in a way that will be accepted by the input
export function normalizeUTCDateTime(value, timezone) {
    return normalizeISODateTime(value, timezone).isoValue || '';
}

export function normalizeTime(value) {
    return normalizeISOTime(value).isoValue || '';
}

// parses the input value and converts it back to UTC from the user's timezone
export function normalizeDateTimeToUTC(value, timezone) {
    return normalizeFormattedDateTime(value, timezone) || '';
}
