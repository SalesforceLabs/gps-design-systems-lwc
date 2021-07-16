/*
import labelInvalidDate from '@salesforce/label/LightningDateTimePicker.invalidDate';
import labelRangeOverflow from '@salesforce/label/LightningDateTimePicker.rangeOverflow';
import labelRangeUnderflow from '@salesforce/label/LightningDateTimePicker.rangeUnderflow';
*/
//import labelRequired from '@salesforce/label/LightningControl.required';
import shortTimeFormat from '@salesforce/i18n/dateTime.shortTimeFormat';
import mediumTimeFormat from '@salesforce/i18n/dateTime.mediumTimeFormat';
import { LightningElement, track, api } from 'lwc';
import { getTimeToHighlight } from './utils';
import { classSet, formatLabel } from 'c/nswUtils';
import {
    isBefore,
    isAfter,
    formatTime,
    parseTime,
    getISOTimeString,
    normalizeISOTime,
    normalizeFormattedTime,
} from 'c/nswInternationalizationLibrary';
import { removeTimeZoneSuffix } from 'c/nswIso8601Utils';
import {
    normalizeBoolean,
    synchronizeAttrs,
    normalizeString,
} from 'c/nswUtilsPrivate';

const i18n = {
    invalidDate: "invalid date", //labelInvalidDate,
    rangeOverflow: "range underflow", //labelRangeOverflow,
    rangeUnderflow: "range underflow", //labelRangeUnderflow,
    required: "*", //labelRequired,
};

const STEP = 15; // in minutes
const TIME_STYLE = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
};

export default class NswDSFormTimePickerBase extends LightningElement {
    static delegatesFocus = true;

    get inputPill() {
        return {
            label: 'Coca-Cola, Inc.',
            iconName: 'standard:account',
            iconAlternativeText: 'account'
        }
    };

    @track _disabled = false;
    @track _required = false;
    @track _displayValue = null;
    @track _value = null;
    @track _min;
    @track _max;
    @track _items = [];
    @track _fieldLevelHelp;
    @track _variant = 'lookup';
    @track _mainInputId;
    @track _errorMessage;
    @track _readonly = true;
    @track _describedByElements = [];

    @api isLegend = false;
    @api helper = "";

    /**
     * Controls auto-filling of the input. Set the attribute to pass
     * through autocomplete values to be interpreted by the browser.
     * By default autocomplete is off to avoid overlap of dropdowns.
     * @type {string}
     */
    @api autocomplete = 'off';

    @api ariaLabelledByElement;
    @api ariaControlsElement;
    @api ariaLabel;
    @api label;
    @api name;
    @api placeholder = '';

    @api messageWhenValueMissing;
    _ariaDescribedByElements;

    @api
    get messageWhenBadInput() {
        return (
            this._messageWhenBadInput ||
            formatLabel(i18n.invalidDate, this.timeFormat)
        );
    }
    set messageWhenBadInput(message) {
        this._messageWhenBadInput = message;
    }

    @api
    get messageWhenRangeOverflow() {
        // using isoValue since the manually entered time could have seconds/milliseconds and the locale format generally doesn't have this precision
        return (
            this._messageWhenRangeOverflow ||
            formatLabel(
                i18n.rangeOverflow,
                normalizeISOTime(this.max, this.timeFormat).isoValue
            )
        );
    }
    set messageWhenRangeOverflow(message) {
        this._messageWhenRangeOverflow = message;
    }

    @api
    get messageWhenRangeUnderflow() {
        return (
            this._messageWhenRangeUnderflow ||
            formatLabel(
                i18n.rangeUnderflow,
                normalizeISOTime(this.min, this.timeFormat).isoValue
            )
        );
    }
    set messageWhenRangeUnderflow(message) {
        this._messageWhenRangeUnderflow = message;
    }

    set ariaDescribedByElements(el) {
        if (Array.isArray(el)) {
            this._ariaDescribedByElements = el;
        } else {
            this.ariaDescribedByElements = [el];
        }
    }

    @api
    get ariaDescribedByElements() {
        return this._ariaDescribedByElements;
    }

    @api
    get value() {
        return this._value;
    }
    set value(newValue) {
        const normalizedValue = removeTimeZoneSuffix(newValue);
        const normalizedTime = normalizeISOTime(
            normalizedValue,
            this.timeFormat
        );

        this._value = normalizedTime.isoValue;
        this._displayValue = normalizedTime.displayValue;
    }

    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    @api
    get readOnly() {
        return this._readonly;
    }
    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
/*        if (this._readonly) {
            this._variant = VARIANT.STANDARD;
        }*/
    }

    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
    }

    @api
    hasBadInput() {
        return !!this._displayValue && this._value === null;
    }

    @api
    showHelpMessage(message) {
        if (!message) {
            this.classList.remove('slds-has-error');
            this._errorMessage = '';
        } else {
            this.classList.add('slds-has-error');
            this._errorMessage = message;
        }
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    @api
    get max() {
        return this._max;
    }

    set max(newValue) {
        this._max = newValue;
        if (this.connected) {
            this.rebuildAndUpdateTimeList();
        }
    }

    @api
    get min() {
        return this._min;
    }

    set min(newValue) {
        this._min = newValue;
        if (this.connected) {
            this.rebuildAndUpdateTimeList();
        }
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (this.connected) {
            this.getCombobox().focus();
        }
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        if (this.connected) {
            this.getCombobox().blur();
        }
    }

    @api
    get timeStyle() {
        return this._timeStyle;
    }

    set timeStyle(value) {
        this._timeStyle = normalizeString(value, {
            fallbackValue: TIME_STYLE.SHORT,
            validValues: [TIME_STYLE.SHORT, TIME_STYLE.MEDIUM, TIME_STYLE.LONG],
        });
        this.timeFormat = this.getTimeFormatFromStyle(this._timeStyle);

        const normalizedDate = normalizeISOTime(this._value, this.timeFormat);
        this._displayValue = normalizedDate.displayValue;
    }

    connectedCallback() {
        this.connected = true;
    }

    disconnectedCallback() {
        this.connected = false;
    }

    synchronizeA11y() {
        const label = this.template.querySelector('label');
        const comboBox = this.template.querySelector('c-nsw-d-s-base-combobox');
        let describedByElements = [];
        if (this._ariaDescribedByElements) {
            describedByElements = describedByElements.concat(
                this._ariaDescribedByElements
            );
        }

        const errorMessage = this.template.querySelector(
            '[data-error-message]'
        );

        if (errorMessage) {
            describedByElements.push(errorMessage);
        }

        comboBox.inputDescribedByElements = describedByElements;
        synchronizeAttrs(label, {
            for: this._mainInputId,
        });
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    get displayValue() {
        return this._displayValue;
    }

    get items() {
        return this._items;
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return false; //this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleReady(e) {
        this._mainInputId = e.detail.id;
    }

    buildTimeList() {
        // We should always display the options in the short style since m/l will add an extra :00 to the options.
        const optionsTimeFormat = shortTimeFormat;
        const timeList = [];
        const minTime = parseTime(removeTimeZoneSuffix(this.min));
        const minHour = minTime ? minTime.getHours() : 0;

        const maxTime = parseTime(removeTimeZoneSuffix(this.max));
        const maxHour = maxTime ? maxTime.getHours() + 1 : 24;

        const date = new Date(minTime.getTime()); // ESC new Date();
        for (let hour = minHour; hour < maxHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += STEP) {
                date.setHours(hour, minutes);
                date.setSeconds(0, 0);

                if (this.isBeforeMinTime(date, minTime)) {
                    continue; // eslint-disable-line no-continue
                }

                if (this.isAfterMaxTime(date, maxTime)) {
                    break;
                }

                // @todo: should we always display it short in the combobox given that it makes no sense?
                timeList.push({
                    type: 'option-inline',
                    text: this.format(date, optionsTimeFormat),
                    value: this.format(date),
                });
            }
        }

        return timeList;
    }

    get timeList() {
        if (!this._timeList) {
            this._timeList = this.buildTimeList();
        }

        if (!this._value) {
            return this._timeList;
        }

        const timeToHighlight = getTimeToHighlight(this._value, STEP);

        const timeList = this._timeList.map((item) => {
            const itemCopy = Object.assign({}, item);
            if (item.value === this._value) {
                itemCopy.iconName = 'utility:check';
                itemCopy.checked = true;
            } else {
                itemCopy.checked = false;
            }
            if (item.value === timeToHighlight) {
                itemCopy.highlight = true;
            }
            return itemCopy;
        });

        return timeList;
    }

    rebuildAndUpdateTimeList() {
        // forcing the time list to be rebuilt
        this._timeList = null;
        this._items = this.timeList;
    }

    get timeFormat() {
        if (!this._timeFormat) {
            this._timeFormat = this.getTimeFormatFromStyle();
        }
        return this._timeFormat;
    }

    set timeFormat(value) {
        this._timeFormat = value;
    }

    getCombobox() {
        return this.template.querySelector('c-nsw-d-s-base-combobox');
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleInputChange(event) {
        event.preventDefault();
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.detail.text;
        this._value = this.parseFormattedTime(this._displayValue);

        this._items = this.timeList;

        this.dispatchChangeEvent();
    }

    handleTextInput(event) {
        event.preventDefault();
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.detail.text;
    }

    handleTimeSelect(event) {
        event.stopPropagation();

        // for some reason this event is fired without detail from grouped-combobox
        if (!event.detail) {
            return;
        }

        this._value = event.detail.value;
        this._displayValue = normalizeISOTime(
            this._value,
            this.timeFormat
        ).displayValue;

        this._items = this.timeList;
        this.dispatchChangeEvent();
    }

    handleDropdownOpenRequest() {
        this._items = this.timeList;
    }

    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this._value,
                },
            })
        );
    }

    format(date, formatString) {
        if (formatString) {
            return formatTime(date, formatString);
        }
        return getISOTimeString(date);
    }

    isBeforeMinTime(date, minTime) {
        const minDate = minTime || parseTime(removeTimeZoneSuffix(this.min));
        let x = minDate ? isBefore(date, minDate, 'minute') : false;
        return x;
    }

    isAfterMaxTime(date, maxTime) {
        const maxDate = maxTime || parseTime(removeTimeZoneSuffix(this.max));
        return maxDate ? isAfter(date, maxDate, 'minute') : false;
    }

    getTimeFormatFromStyle(timeStyle) {
        let timeFormat;
        switch (timeStyle) {
            case TIME_STYLE.MEDIUM:
            case TIME_STYLE.LONG:
                timeFormat = mediumTimeFormat;
                break;
            default:
                timeFormat = shortTimeFormat;
                break;
        }

        return timeFormat;
    }

    get allowedTimeFormats() {
        // the locale.timeFormat is the medium format. Locale dont supports a large
        // time format at the moment.
        return [mediumTimeFormat, shortTimeFormat];
    }

    /**
     * Parses the input time and sets the timeFormat used to parse the displayValue
     * if it is a valid time.
     *
     * @param {String} displayValue - The input date.
     * @return {null | string} - A normalized formatted time if displayValue is valid. null otherwise.
     */
    parseFormattedTime(displayValue) {
        const allowedFormats = this.allowedTimeFormats;
        const n = allowedFormats.length;
        let i = 0,
            value = null;

        do {
            value = normalizeFormattedTime(displayValue, allowedFormats[i]);
            i++;
        } while (value === null && i < n);

        if (value !== null) {
            this.timeFormat = allowedFormats[i - 1];
        }

        return value;
    }

    get hasExternalLabel() {
        return false;
        /* TODO
        return (
            this.variant === VARIANT.LABEL_HIDDEN &&
            this.ariaLabelledByElement &&
            this.ariaLabelledByElement.length
        );
        */
    }
}
