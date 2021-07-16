// This is a library for all calls to the aura localizationService.

import { getLocalizationService } from 'c/nswConfigProvider';
import { isValidISOTimeString } from 'c/nswIso8601Utils';

export function isBefore(date1, date2, unit) {
    return getLocalizationService().isBefore(date1, date2, unit);
}

export function isAfter(date1, date2, unit) {
    return getLocalizationService().isAfter(date1, date2, unit);
}

export function formatDateTimeUTC(date) {
    return getLocalizationService().formatDateTimeUTC(date);
}

export function formatDate(dateString, format, locale) {
    return getLocalizationService().formatDate(dateString, format, locale);
}

export function formatDateUTC(dateString, format, locale) {
    return getLocalizationService().formatDateUTC(dateString, format, locale);
}

export function formatTime(timeString, format) {
    return getLocalizationService().formatTime(timeString, format);
}

export function parseDateTimeUTC(dateTimeString) {
    return getLocalizationService().parseDateTimeUTC(dateTimeString);
}

export function parseDateTimeISO8601(dateTimeString) {
    return getLocalizationService().parseDateTimeISO8601(dateTimeString);
}

export function parseDateTime(dateTimeString, format, strictMode) {
    return getLocalizationService().parseDateTime(
        dateTimeString,
        format,
        strictMode
    );
}

export function syncUTCToWallTime(date, timeZone) {
    let converted = null;

    // eslint-disable-next-line new-cap
    getLocalizationService().UTCToWallTime(date, timeZone, (result) => {
        converted = result;
    });
    return converted;
}

export function syncWallTimeToUTC(date, timeZone) {
    let converted = null;

    // eslint-disable-next-line new-cap
    getLocalizationService().WallTimeToUTC(date, timeZone, (result) => {
        converted = result;
    });
    return converted;
}

export function toOtherCalendar(date) {
    return getLocalizationService().translateToOtherCalendar(date);
}

export function fromOtherCalendar(date) {
    return getLocalizationService().translateFromOtherCalendar(date);
}

export function toLocalizedDigits(input) {
    return getLocalizationService().translateToLocalizedDigits(input);
}

export function fromLocalizedDigits(input) {
    return getLocalizationService().translateFromLocalizedDigits(input);
}

// This belongs to localization service; i.e. getLocalizationService().parseTime()
// Should be removed after it's been added to the localization service
export function parseTime(timeString, format, strictParsing) {
    if (!timeString) {
        return null;
    }

    if (!format) {
        if (!isValidISOTimeString(timeString)) {
            return null;
        }

        return parseDateTimeISO8601(timeString);
    }

    const parseString = timeString.replace(/(\d)([AaPp][Mm])/g, '$1 $2');

    // Modifying the time string so that strict parsing doesn't break on minor deviations
    const parseFormat = format
        .replace(/(\b|[^h])h{2}(?!h)/g, '$1h')
        .replace(/(\b|[^H])H{2}(?!H)/g, '$1H')
        .replace(/(\b|[^m])m{2}(?!m)/g, '$1m')
        .replace(/\s*A/g, ' A')
        .trim();

    const acceptableFormats = [parseFormat];
    // We want to be lenient and accept input values with seconds or milliseconds precision.
    // So even though we may display the time as 10:23 AM, we would accept input values like 10:23:30.555 AM.
    acceptableFormats.push(
        parseFormat.replace('m', 'm:s'),
        parseFormat.replace('m', 'm:s.S'),
        parseFormat.replace('m', 'm:s.SS'),
        parseFormat.replace('m', 'm:s.SSS')
    );

    // Start parsing from the most strict format (i.e. time with milliseconds).
    // The strict mode parsing of time strings using parseDateTime seems to be lenient for certain formats
    acceptableFormats.reverse();

    for (let i = 0; i < acceptableFormats.length; i++) {
        const time = parseDateTime(
            parseString,
            acceptableFormats[i],
            strictParsing
        );

        if (time) {
            return time;
        }
    }

    return null;
}

// This is called from the numberFormat library when the value exceeds the safe length.
export function getNumberFormat(format) {
    return getLocalizationService().getNumberFormat(format);
}

export function duration(value, unit) {
    return getLocalizationService().duration(value, unit);
}

export function displayDuration(value, withSuffix) {
    return getLocalizationService().displayDuration(value, withSuffix);
}
