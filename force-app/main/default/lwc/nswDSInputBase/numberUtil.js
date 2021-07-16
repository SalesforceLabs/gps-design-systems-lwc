import groupingSeparator from '@salesforce/i18n/number.groupingSeparator';
import decimalSeparator from '@salesforce/i18n/number.decimalSeparator';
import {
    fromLocalizedDigits,
    toLocalizedDigits,
    numberFormat,
} from 'c/nswInternationalizationLibrary';
import { isEmptyString } from 'c/nswInputUtils';

const VALID_NUMBER_CHARACTERS_EXPRESSION = new RegExp(
    // eslint-disable-next-line no-useless-escape
    '^[-+0-9kKmMbBtTeE.,\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9' +
        '\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF' +
        '\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF' +
        '\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9' +
        '\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9' +
        '\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89' +
        '\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49' +
        '\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909' +
        '\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9' +
        ']$'
);

const SHORTCUT_FACTORS = {
    k: 3,
    m: 6,
    b: 9,
    t: 12,
};
const SHORTCUTS = ['k', 'm', 'b', 't'];

const NUMBER_SYMBOLS = ['+', '-'];

export function toIsoDecimal(numberAsString) {
    const result = transformLocalizedNumberToIsoDecimal(numberAsString);
    if (isNaN(result)) {
        return '';
    }
    return result;
}

export function isValidNumber(numberAsString) {
    return !isNaN(transformLocalizedNumberToIsoDecimal(numberAsString));
}

export function fromIsoDecimal(numberAsString) {
    return toLocalizedDigits(numberAsString.replace('.', decimalSeparator));
}

// TODO: Too many options, simplify
export function increaseNumberByStep({
    value,
    increment,
    step,
    fractionDigits,
}) {
    const startingValue = value === '' || value == null ? '0' : value;

    const stepAsFloat = parseFloat(step);

    let result;
    if (isNaN(stepAsFloat)) {
        result = parseFloat(startingValue) + increment;
    } else {
        // ideally we'd round the value to the closest correct step, so that if say the step is '2', and the
        // current value is '1' it would increment to '2' instead of '3', since the former would be the valid
        // number given the step constraint, however this would significantly complicate the code, keeping
        // it simple for now.
        const increaseBy = increment * stepAsFloat;
        result = parseFloat(startingValue) + increaseBy;
    }
    return result.toFixed(fractionDigits);
}

export function calculateFractionDigitsFromStep(step) {
    let calculatedFractionDigits;

    if (step) {
        const stepAsString = String(step).toLowerCase();
        if (stepAsString !== 'any') {
            // lowering the case because we're checking for exponent format as well
            let fractionDigits = 0;
            if (
                stepAsString.indexOf('.') >= 0 &&
                stepAsString.indexOf('e') < 0
            ) {
                const fractionalPart = stepAsString.split('.')[1];
                // we're parsing to account for cases where the step is
                // '1.0', or '1.000', etc.
                if (parseInt(fractionalPart, 10) > 0) {
                    fractionDigits = fractionalPart.length;
                }
            } else if (stepAsString.indexOf('e-') > 0) {
                // exponent form eg. 1.5e-5
                const splitOnExponent = stepAsString.split('e-');
                const fractionalPart = splitOnExponent[0].split('.')[1];
                const exponentPart = splitOnExponent[1];
                const fractionalPartLength = fractionalPart
                    ? fractionalPart.length
                    : 0;
                fractionDigits =
                    parseInt(exponentPart, 10) + fractionalPartLength;
            }
            calculatedFractionDigits = fractionDigits;
        }
    }
    return calculatedFractionDigits;
}

export function formatNumber(numberAsString, options) {
    if (isEmptyString(numberAsString)) {
        return '';
    }

    let formattedValue = numberAsString;
    let inputValue = numberAsString;

    // set formatter style & default options
    const formatStyle = options.style;
    const formatOptions = { style: formatStyle };

    formatOptions.minimumFractionDigits = options.minimumFractionDigits;
    formatOptions.maximumFractionDigits = options.maximumFractionDigits;

    if (formatStyle === 'percent-fixed') {
        // percent-fixed just uses percent format and divides the value by 100
        // before passing to the library, this is to deal with the
        // fact that percentages in salesforce are 0-100, not 0-1
        formatOptions.style = 'percent';
        const inputValueAsString = inputValue.toString();
        const normalisedNumberInPercent = parseFloat(inputValue) / 100;

        // If the number contains fraction digits and is not in an exponent format
        if (
            inputValueAsString.indexOf('.') > 0 &&
            inputValueAsString.indexOf('e') < 0
        ) {
            // Depending on the input number, division by 100 may lead to rounding errors
            // (e.g 0.785 / 100 is 0.007850000000000001), so we need to round back
            // to the correct precision, that is - existing number of fractional digits
            // plus extra 2 for division by 100.
            inputValue = normalisedNumberInPercent.toFixed(
                inputValueAsString.split('.')[1].length + 2
            );
        } else {
            inputValue = normalisedNumberInPercent;
        }
    }

    try {
        formattedValue = numberFormat(formatOptions).format(inputValue) || '';
    } catch (ignore) {
        // ignore any errors
    }
    return formattedValue;
}

// Exporting only to test, separators are only overridden in the tests
export function transformLocalizedNumberToIsoDecimal(
    numberAsString,
    separators
) {
    if (numberAsString == null || numberAsString.length === 0) {
        return '';
    }

    const decimalSymbol = separators
        ? separators.decimalSeparator
        : decimalSeparator;
    const groupingSymbol = separators
        ? separators.groupSeparator
        : groupingSeparator;

    // remove the grouping separator
    let result = numberAsString.split(groupingSymbol).join('');
    if (decimalSymbol !== '.') {
        // replace the local decimal separator with a
        result = result.replace(decimalSymbol, '.');
    }
    return expandShortcuts(addLeadingZeroIfNeeded(fromLocalizedDigits(result)));
}

export function isValidNumberCharacter(character) {
    return VALID_NUMBER_CHARACTERS_EXPRESSION.test(character);
}

export function normalizeNumber(value) {
    if (value === undefined || value === null || isNaN(value)) {
        return '';
    }
    return String(value);
}

export function hasValidNumberSymbol(value) {
    const validSymbols = NUMBER_SYMBOLS.join('');
    const matchSymbols = new RegExp(`[${validSymbols}]`);
    return value.match(matchSymbols) ? true : false;
}

export function hasValidNumberShortcut(value) {
    const result = value.toLowerCase().trim();
    const kmb = SHORTCUTS.join('');
    // Cannot have two shortcuts /([kmb])/g
    const matchShortcuts = new RegExp(`([${kmb}])`, 'g');
    const shortcutMatch = result.match(matchShortcuts);
    if (shortcutMatch && shortcutMatch.length > 1) {
        return false;
    }
    // Must end with 'm', 'k', 'b' and more than just a single letter
    const matchEndsWith = new RegExp(`[${kmb}]$`);
    const endsWithShortcut = result.match(matchEndsWith) !== null;
    // has 'm' / 'k' / 'b' and more than just them (ie. result of 'm' / 'k' / 'b' are not valid.
    return endsWithShortcut && result.length > 1;
}

// Exported for testing only
export function expandShortcuts(isoValue) {
    if (!hasValidNumberShortcut(isoValue)) {
        return isoValue;
    }
    let result = isoValue.toLowerCase().trim();
    const shortcut = result.charAt(result.length - 1);
    // remove the suffix
    result = result.substring(0, result.length - 1);
    if (isNaN(result)) {
        return isoValue;
    }
    const parts = result.split('.');
    let fractionDigits = 0;
    const hasDecimalPart = parts.length > 1;
    if (hasDecimalPart) {
        fractionDigits = parts[1].length;
    }
    const exponent = SHORTCUT_FACTORS[shortcut];
    // since multiplication may result in loss of precision on javascript's part,
    // we're calculating here the number of fraction digits needed and formatting
    // the number at that
    const newFractionDigits = Math.max(0, fractionDigits - exponent);
    return parseFloat(result * Math.pow(10, exponent)).toFixed(
        newFractionDigits
    );
}

function addLeadingZeroIfNeeded(result) {
    // If the number starts with +. OR  -. OR . ; insert a 0 before the decimal separator.
    // eg. -.2 -> -0.2
    const decimalSeparatorLocation = result.indexOf('.');
    if (decimalSeparatorLocation === 0 || decimalSeparatorLocation === 1) {
        const firstCharacter = result.charAt(0);
        if (
            firstCharacter === '+' ||
            firstCharacter === '-' ||
            firstCharacter === '.'
        ) {
            result =
                result.substring(0, decimalSeparatorLocation) +
                '0' +
                result.substring(decimalSeparatorLocation);
        }
    }
    return result;
}
