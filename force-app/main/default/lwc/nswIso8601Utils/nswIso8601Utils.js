/*
 * Regex to test a string for an ISO8601 Date. The following formats are matched.
 * Note that if a time element is present (e.g. 'T'), the string should have a time zone designator (Z or +hh:mm or -hh:mm).
 *
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.STZD
 *
 *
 * @see: https://www.w3.org/TR/NOTE-datetime
 */
const ISO8601_STRICT_PATTERN =
    /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z){1})?)?)?$/i;

/* Regex to test a string for an ISO8601 partial time or full time:
 * hh:mm
 * hh:mm:ss
 * hh:mm:ss.S
 * full time = partial time + TZD
 */
const ISO8601_TIME_PATTERN = /^\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

export const STANDARD_TIME_FORMAT = 'HH:mm:ss.SSS';
export const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_SEPARATOR = 'T';
const TIMEZONE_INDICATOR = /(Z|([+-])(\d{2}):(\d{2}))$/;

export function isValidISODateTimeString(dateTimeString) {
    return isValidISO8601String(dateTimeString) && isValidDate(dateTimeString);
}

export function isValidISOTimeString(timeString) {
    if (!isValidISO8601TimeString(timeString)) {
        return false;
    }

    const timeOnly = removeTimeZoneSuffix(timeString);
    return isValidDate(`2018-09-09T${timeOnly}Z`);
}

export function removeTimeZoneSuffix(dateTimeString) {
    if (typeof dateTimeString === 'string') {
        return dateTimeString.split(TIMEZONE_INDICATOR)[0];
    }
    return dateTimeString;
}

function isValidISO8601String(dateTimeString) {
    if (typeof dateTimeString !== 'string') {
        return false;
    }
    return ISO8601_STRICT_PATTERN.test(dateTimeString);
}

function isValidISO8601TimeString(timeString) {
    if (typeof timeString !== 'string') {
        return false;
    }
    return ISO8601_TIME_PATTERN.test(timeString);
}

function isValidDate(value) {
    // Date.parse returns NaN if the argument doesn't represent a valid date
    const timeStamp = Date.parse(value);
    return isFinite(timeStamp);
}
