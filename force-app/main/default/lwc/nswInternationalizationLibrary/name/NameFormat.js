// This is a library built from Globalization's repo
// https://git.soma.salesforce.com/Globalization/name.js
// This will be added/updated through a build process in the future
/* eslint-disable */
var data = {
    DEFAULT: {
        short_f: '%F %L',
        medium_f: '%F %M %L',
        long_f: '%S %F %M %L %X %I',
        input: 'SFMLXI',
    },
    vi: {
        short_f: '%L %F',
        medium_f: '%L %M %F',
        long_f: '%L %M %F %X %I',
        input: 'SLFMXI',
    },
    vi_VN: {
        _ref: 'vi',
    },
    hu: {
        short_f: '%L %F',
        medium_f: '%L %F',
        long_f: '%L %F %M %X %I',
        input: 'SLFMXI',
    },
    hu_HU: {
        _ref: 'hu',
    },
    ja: {
        short_f: '%L %F',
        medium_f: '%L %M %F',
        long_f: '%L %M %F %X %I',
        input: 'SLMFXI',
    },
    ja_JP: {
        _ref: 'ja',
    },
    ko: {
        _ref: 'ja',
    },
    ko_KR: {
        _ref: 'ja',
    },
    zh: {
        _ref: 'ja',
    },
    zh_CN: {
        _ref: 'ja',
    },
    zh_CN_PINYIN: {
        _ref: 'ja',
    },
    zh_CN_STROKE: {
        _ref: 'ja',
    },
    zh_HK: {
        _ref: 'ja',
    },
    zh_HK_STROKE: {
        _ref: 'ja',
    },
    zh_MO: {
        _ref: 'ja',
    },
    zh_SG: {
        _ref: 'ja',
    },
    zh_TW: {
        _ref: 'ja',
    },
    zh_TW_STROKE: {
        _ref: 'ja',
    },
};

// Define all available fields.

/**
 S: Salutation
 F: First Name(givenName)
 M: Middle Name
 L: Last Name(familyName)
 X: Suffix
 I: Informal Name
 */

var fieldConstants = {
    SALUTATION: Symbol('Salutation'),
    FIRST: Symbol('First Name'),
    MIDDLE: Symbol('Middle Name'),
    LAST: Symbol('Last Name'),
    SUFFIX: Symbol('Suffix'),
    INFORMAL: Symbol('Informal Name'),
};

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var Format = function Format(parts) {
    _classCallCheck(this, Format);

    this.parts = Object.freeze(parts);
    Object.freeze(this);
};

/**
 * Represents a field within the format
 */

var FieldFormatPart = function FieldFormatPart(field) {
    _classCallCheck(this, FieldFormatPart);

    this.field = field;
    this.type = 'field';
    Object.freeze(this);
};

/**
 * Represents text to be output directly
 */

var TextFormatPart = function TextFormatPart(text) {
    _classCallCheck(this, TextFormatPart);

    this.type = 'text';
    this.text = text;
    Object.freeze(this);
};

var fieldFormatParts = Object.freeze({
    SALUTATION: new FieldFormatPart(fieldConstants.SALUTATION),
    FIRST: new FieldFormatPart(fieldConstants.FIRST),
    MIDDLE: new FieldFormatPart(fieldConstants.MIDDLE),
    LAST: new FieldFormatPart(fieldConstants.LAST),
    SUFFIX: new FieldFormatPart(fieldConstants.SUFFIX),
    INFORMAL: new FieldFormatPart(fieldConstants.INFORMAL),
});

var FormatParser = (function () {
    function FormatParser() {
        _classCallCheck(this, FormatParser);
    }

    _createClass(FormatParser, [
        {
            key: 'parse',

            /**
             * Parses the format
             * @param {string} fmt the format to be parsed
             * @returns {Format}
             */
            value: function parse(fmt) {
                var nodes = [];
                var textBuffer = '';

                // parse the format string
                for (var i = 0; i < fmt.length; i = i + 1) {
                    if (fmt[i] === '%') {
                        i = i + 1; // move to the next character after %

                        // end the last text buffer
                        if (textBuffer.length > 0) {
                            nodes.push(
                                Object.freeze(new TextFormatPart(textBuffer))
                            );
                            textBuffer = '';
                        }

                        if (i >= fmt.length) {
                            throw new Error(
                                'Unexpected end of format. Symbol at ' +
                                    (i - 1) +
                                    ' should be followed by a valid field code'
                            );
                        }

                        var code = fmt[i];
                        switch (code) {
                            case 'S':
                                nodes.push(fieldFormatParts.SALUTATION);
                                break;

                            case 'F':
                                nodes.push(fieldFormatParts.FIRST);
                                break;

                            case 'M':
                                nodes.push(fieldFormatParts.MIDDLE);
                                break;

                            case 'L':
                                nodes.push(fieldFormatParts.LAST);
                                break;

                            case 'X':
                                nodes.push(fieldFormatParts.SUFFIX);
                                break;

                            case 'I':
                                nodes.push(fieldFormatParts.INFORMAL);
                                break;

                            default:
                                // TODO log the bad symbol and continue
                                break;
                        }
                    } else {
                        // if it wasn't a symbol, then just output the value directly
                        textBuffer += fmt[i];
                    }
                }

                if (textBuffer.length > 0) {
                    nodes.push(new TextFormatPart(textBuffer));
                }

                return new Format(nodes);
            },
        },
    ]);

    return FormatParser;
})();

var formatParser = new FormatParser();

var name = {
    /**
     * S: Salutation
     * F: First Name(givenName)
     * M: Middle Name
     * L: Last Name(familyName)
     * X: Suffix
     * I: Informal Name
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @return {{short: string, medium: string, long: string, input: string}} format data
     */
    getNameInfoForLocale: function getNameInfoForLocale(localeStr) {
        var key = this.getFallback(localeStr);
        if (data[key]) {
            // Double check.
            var cloneNameInfo = Object.freeze(Object.assign({}, data[key]));
            return Object.freeze({
                name: cloneNameInfo,
            });
        }
    },

    /**
     * S: Salutation
     * F: First Name(givenName)
     * M: Middle Name
     * L: Last Name(familyName)
     * X: Suffix
     * I: Informal Name
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @return {string} format pattern
     */
    getNameFormatPatternMedium: function getNameFormatPatternMedium(localeStr) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return data[key].medium_f;
        }
    },

    /**
     * S: Salutation
     * F: First Name(givenName)
     * M: Middle Name
     * L: Last Name(familyName)
     * X: Suffix
     * I: Informal Name
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @return {string} format pattern
     */
    getNameFormatPatternShort: function getNameFormatPatternShort(localeStr) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return data[key].short_f;
        }
    },

    /**
     * S: Salutation
     * F: First Name(givenName)
     * M: Middle Name
     * L: Last Name(familyName)
     * X: Suffix
     * I: Informal Name
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @return {string} format pattern
     */
    getNameFormatPatternLong: function getNameFormatPatternLong(localeStr) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return data[key].long_f;
        }
    },

    /**
     * S: Salutation
     * F: First Name(givenName)
     * M: Middle Name
     * L: Last Name(familyName)
     * X: Suffix
     * I: Informal Name
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @return {string} input order
     */
    getNameInputOrder: function getNameInputOrder(localeStr) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return data[key].input;
        }
    },

    /**
     * Format name values for given locale.
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @param {{first: string, middle: string, last: string, salutation: string, suffix: string, informal: string}} values
     * @returns {string} the formatted name
     */
    formatNameShort: function formatNameShort(localeStr, values) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return this.buildName(data[key].short_f, values);
        }
    },

    /**
     * Format name values for given locale.
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @param {{first: string, middle: string, last: string, salutation: string, suffix: string, informal: string}} values
     * @returns {string} the formatted name
     */
    formatNameMedium: function formatNameMedium(localeStr, values) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return this.buildName(data[key].medium_f, values);
        }
    },

    /**
     * Format name values for given locale.
     * @param {string} locale string, like zh_CN, zh_CN_PINYIN, or de.
     * @param {{first: string, middle: string, last: string, salutation: string, suffix: string, informal: string}} values
     * @returns {string} the formatted name
     */
    formatNameLong: function formatNameLong(localeStr, values) {
        var key = this.getFallback(localeStr);

        if (data[key]) {
            // Double check.
            return this.buildName(data[key].long_f, values);
        }
    },

    /**
     * Creates an array of address lines given the format and the values to use.
     * @param {string} pattern
     * @param @param {{first: string, middle: string, last: string, salutation: string, suffix: string, informal: string}} values
     * @returns {string} the text for use in the address
     */
    buildName: function buildName(pattern, values) {
        var format = formatParser.parse(pattern);
        var sb = [];
        for (var i = 0; i < format.parts.length; i++) {
            var part = format.parts[i];

            if (part.type === 'text') {
                sb.push(part.text);
            } else if (part.type === 'field') {
                if (part.field === fieldConstants.SALUTATION) {
                    sb.push(values.salutation || '');
                } else if (part.field === fieldConstants.FIRST) {
                    sb.push(values.first || '');
                } else if (part.field === fieldConstants.MIDDLE) {
                    sb.push(values.middle || '');
                } else if (part.field === fieldConstants.LAST) {
                    sb.push(values.last || '');
                } else if (part.field === fieldConstants.SUFFIX) {
                    sb.push(values.suffix || '');
                } else if (part.field === fieldConstants.INFORMAL) {
                    sb.push(values.informal || '');
                } else {
                }
            }
        }

        return sb.join('').trim().replace(/  /g, ' ');
    },

    // Resolve the reference by tracing down the _ref value.
    followReferences: function followReferences(key) {
        if (data[key] && data[key]._ref) {
            return this.followReferences(data[key]._ref);
        }
        return key;
    },

    // Get fall back key.
    getFallback: function getFallback(localeStr) {
        // Resolve the reference.
        var key = this.followReferences(localeStr);

        if (!data[key]) {
            return 'DEFAULT'; // Always fall back to 'US'.
        }
        return key;
    },
};

export { name };
