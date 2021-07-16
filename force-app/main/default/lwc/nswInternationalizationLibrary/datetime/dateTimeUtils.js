import { assert } from 'c/nswUtilsPrivate';
import mediumDateFormat from '@salesforce/i18n/dateTime.mediumDateFormat';
import mediumTimeFormat from '@salesforce/i18n/dateTime.mediumTimeFormat';
import {
    isValidISODateTimeString,
    isValidISOTimeString,
    removeTimeZoneSuffix,
    STANDARD_DATE_FORMAT,
    TIME_SEPARATOR,
} from 'c/nswIso8601Utils';
import {
    formatDate,
    formatTime,
    formatDateTimeUTC,
    parseDateTimeUTC,
    parseDateTimeISO8601,
    syncUTCToWallTime,
    syncWallTimeToUTC,
    parseTime,
    parseDateTime,
    toOtherCalendar,
    fromOtherCalendar,
} from '../localizationService';

export function normalizeISODate(value, format) {
    const dateValue = typeof value === 'string' ? value.trim() : value;
    if (!dateValue) {
        return {
            isoValue: null,
            displayValue: value || '',
        };
    }

    // if value is an ISO string, only fetch the date part
    const dateOnlyString =
        (typeof dateValue === 'string' && dateValue.split(TIME_SEPARATOR)[0]) ||
        dateValue;

    assert(
        isValidISODateTimeString(dateOnlyString),
        `datetime component: The value attribute accepts a valid ISO8601 formatted string ` +
            `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`
    );

    const parsedDate = parseDateTime(dateOnlyString, STANDARD_DATE_FORMAT);
    if (!parsedDate) {
        return {
            isoValue: null,
            displayValue: value || '',
        };
    }

    // convert from Gregorian to Buddhist Calendar if necessary
    const civilDate = toOtherCalendar(parsedDate);

    return {
        isoValue: dateOnlyString,
        displayValue: formatDate(civilDate, format),
    };
}

export function normalizeISOTime(value, format) {
    // We are not converting the time to the user's timezone. All values are displayed and saved as UTC time values
    const normalizedValue = removeTimeZoneSuffix(value);

    const timeValue =
        typeof normalizedValue === 'string'
            ? normalizedValue.trim()
            : normalizedValue;
    if (!timeValue) {
        return {
            isoValue: null,
            displayValue: value || '',
        };
    }

    assert(
        isValidISOTimeString(timeValue),
        `datetime component: The value attribute accepts a valid ISO8601 formatted string. ` +
            `but we are getting the ${typeof value} value "${value}" instead.`
    );

    const parsedTime = parseTime(timeValue);
    if (!parsedTime) {
        return {
            isoValue: null,
            displayValue: value || '',
        };
    }
    return {
        isoValue: getISOTimeString(parsedTime),
        displayValue: formatTime(parsedTime, format),
    };
}

export function normalizeISODateTime(value, timezone, format) {
    const dateTimeValue = typeof value === 'string' ? value.trim() : value;
    if (!dateTimeValue) {
        return {
            isoValue: null,
            displayValue: value || '',
        };
    }

    assert(
        isValidISODateTimeString(dateTimeValue),
        `datetime component: The value attribute accepts a valid ISO8601 formatted string ` +
            `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`
    );

    const parsedDate = parseDateTimeISO8601(dateTimeValue);
    if (!parsedDate) {
        return {
            isoValue: null,
            displayValue: value || '',
        };
    }

    const convertedDate = syncUTCToWallTime(parsedDate, timezone);
    return {
        // We are passing the ISO value without a timezone designator.
        // the native input type='datetime-local' who calls this does not accept timezone offset
        isoValue: removeTimeZoneSuffix(convertedDate.toISOString()),
        displayValue: formatDateTimeUTC(convertedDate, format),
    };
}

export function normalizeFormattedDate(value, format) {
    const dateValue = typeof value === 'string' ? value.trim() : value;
    if (!dateValue) {
        return null;
    }

    const parsedDate = parseDateTime(
        dateValue,
        format || mediumDateFormat,
        true
    );
    if (!parsedDate) {
        return null;
    }

    const gregorianDate = fromOtherCalendar(parsedDate);
    return getISODateString(gregorianDate);
}

export function normalizeFormattedTime(value, format) {
    const timeValue = typeof value === 'string' ? value.trim() : value;
    if (!timeValue) {
        return null;
    }

    const parsedDate = parseTime(timeValue, format || mediumTimeFormat, true);
    if (!parsedDate) {
        return null;
    }

    return getISOTimeString(parsedDate);
}

// The value here isn't really formatted, it's always an ISO string in the form isoDate + T + isoTime (without Z).
export function normalizeFormattedDateTime(value, timezone, format) {
    const datetimeValue = typeof value === 'string' ? value.trim() : value;
    if (!datetimeValue) {
        return null;
    }

    // given that value is an ISO string without Z, the method below is equivalent to parseDateTimeISO8601(value + 'Z')
    // However, parseDateTimeUTC is more concise and doesn't need any manipulation of the input (adding Z).
    const parsedDate = parseDateTimeUTC(datetimeValue, format);
    if (!parsedDate) {
        return null;
    }

    const convertedDate = syncWallTimeToUTC(parsedDate, timezone);
    return convertedDate.toISOString();
}

export function getToday() {
    const today = getTodayBasedOnTimezone();
    return getISODateString(today);
}

export function getISODateString(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}`;
}

export function getISOTimeString(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
    )}.${doublePad(date.getMilliseconds())}`;
}

export function getCurrentTime(timezone) {
    const today = getTodayBasedOnTimezone(timezone);
    return pad(today.getHours()) + ':' + pad(today.getMinutes());
}

function getTodayBasedOnTimezone(timezone) {
    const today = new Date();
    today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000); // time in UTC

    // localization service will use $Locale.timezone when no timezone provided
    return syncUTCToWallTime(today, timezone);
}

function pad(n) {
    return Number(n) < 10 ? '0' + n : n;
}

function doublePad(n) {
    const number = Number(n);
    if (number < 10) {
        return '00' + n;
    } else if (number < 100) {
        return '0' + n;
    }
    return n;
}
