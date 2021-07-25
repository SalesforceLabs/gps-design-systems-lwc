import { LightningElement, api } from 'lwc';

import { formatLabel } from 'c/nswUtils';
import { normalizeBoolean, normalizeString, decorateInputForDragon, setDecoratedDragonInputValueWithoutEvent } from "c/nswUtilsPrivate"
import { InteractingState, generateUniqueId, FieldConstraintApiWithProxyInput } from "c/nswInputUtils"
import {
    isBefore,
    isAfter,
    parseDateTime,
    normalizeISODate,
} from 'c/nswInternationalizationLibrary';

import { STANDARD_DATE_FORMAT } from 'c/nswIso8601Utils';

const i18n = {
    invalidDate: "Your entry does not match the allowed format {0}",
    rangeOverflow: "Value must be {0} or earlier",
    rangeUnderflow: "Value must be {0} or later",
    minRangeMessage: "Select a value after {0}",
    maxRangeMessage: "Select a value before {0}",
    minAndMaxRangeMessage: "Select a value between {0} and {1}",
};

import shortDateFormat from '@salesforce/i18n/dateTime.shortDateFormat';
import mediumDateFormat from '@salesforce/i18n/dateTime.mediumDateFormat';
import longDateFormat from '@salesforce/i18n/dateTime.longDateFormat';


const DATE_STYLE = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
};


export default class NswDSDatePickerBase extends LightningElement {
    @api label;
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;
    @api validateOnBlur;


    // ---- i18n

    get i18n() {
        return i18n;
    }


    // ---- date/time

    _max;
    _displayMax;

    /**
     * The maximum acceptable value for the input.  Use this attribute with number,
     * range, date, time, and datetime input types only. For number and range type, the max value is a
     * decimal number. For the date, time, and datetime types, the max value must use a valid string for the type.
     * @type {decimal|string}
     */
    @api
    get max() {
        return this._max;
    }

    set max(value) {
        this._max = parseDateTime(value, STANDARD_DATE_FORMAT); // value;
        this._displayMax = value;

        const normalizedDate = normalizeISODate(value, this.dateFormat);
        if (normalizedDate.isoValue) {
            //this._max = value; //normalizedDate.isoValue;
            this._displayMax = normalizedDate.displayValue;
        }

        //this._max = parseDateTime(value, STANDARD_DATE_FORMAT);
        //this._validate();
        this._updateProxyInputAttributes('max');
    }

    
    /**
      * The minimum acceptable value for the input. Use this attribute with number,
      * range, date, time, and datetime input types only. For number and range types, the min value
      * is a decimal number. For the date, time, and datetime types, the min value must use a valid string for the type.
      * @type {decimal|string}
      */
    
    _min;
    _displayMin;

    @api
    get min() {
        return this._min;
    }

    set min(value) {
        this._min = parseDateTime(value, STANDARD_DATE_FORMAT); // value;
        this._displayMin = value;

        const normalizedDate = normalizeISODate(value, this.dateFormat);
        if (normalizedDate.isoValue) {
            //this._min = value; //normalizedDate.isoValue;
            this._displayMin = normalizedDate.displayValue;
        }

        //this._min = parseDateTime(value, STANDARD_DATE_FORMAT);
        //this._validate();
        this._updateProxyInputAttributes('min');
    }

     
    /**
     * Specifies the value of an input element.
     * @type {object}
     */

    _value;
    _day = null;
    _month = null;
    _year = null;

    @api
    get value() {
        return (typeof(this._value) !== "undefined" &&
                this._value != null) ? this._value.toISOString() : null;
    }

    set value(newValue) {
        const normalizedDate = normalizeISODate(newValue, this.dateFormat);

        this._value = this._value = parseDateTime(newValue, STANDARD_DATE_FORMAT); //normalizedDate.isoValue;
        this._displayValue = normalizedDate.displayValue;

        //this._value = parseDateTime(newValue, STANDARD_DATE_FORMAT);
        //this._validate();
    }

    get day() {
        return this._value ? this._value.getDate() : this._day;
    }

    get month() {
        return this._value ? this._value.getMonth() + 1 : this._month;
    }

    get isJan() { return this.month == 1; }
    get isFeb() { return this.month == 2; }
    get isMar() { return this.month == 3; }
    get isApr() { return this.month == 4; }
    get isMay() { return this.month == 5; }
    get isJun() { return this.month == 6; }
    get isJul() { return this.month == 7; }
    get isAug() { return this.month == 8; }
    get isSep() { return this.month == 9; }
    get isOct() { return this.month == 10; }
    get isNov() { return this.month == 11; }
    get isDec() { return this.month == 12; }

    get year() {
        return this._value ? this._value.getFullYear() : this._year;
    }


    // ---- dateFormat

    _dateFormat;

    get dateFormat() {
        if (!this._dateFormat) {
            this._dateFormat = this.getDateFormatFromStyle();
        }
        return this._dateFormat;
    }

    set dateFormat(value) {
        this._dateFormat = value;
    }

    getDateFormatFromStyle(dateStyle) {
        let dateFormat;
        switch (dateStyle) {
            case DATE_STYLE.SHORT:
                dateFormat = shortDateFormat;
                break;
            case DATE_STYLE.LONG:
                dateFormat = longDateFormat;
                break;
            default:
                dateFormat = mediumDateFormat;
                break;
        }

        return dateFormat;
    }


    // ---- dateStyle

    _dateStyle;

    @api
    get dateStyle() {
        return this._dateStyle;
    }

    set dateStyle(value) {
        this._dateStyle = normalizeString(value, {
            fallbackValue: DATE_STYLE.MEDIUM,
            validValues: [DATE_STYLE.SHORT, DATE_STYLE.MEDIUM, DATE_STYLE.LONG],
        });
        this.dateFormat = this.getDateFormatFromStyle(this._dateStyle);

        const normalizedDate = normalizeISODate(this._value, this.dateFormat);
        this._displayValue = normalizedDate.displayValue;
    }


    /**
     * If present, the input field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */

    _disabled = false;

    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        this._updateProxyInputAttributes('disabled');
    }
 
    /**
     * If present, the input field is read-only and cannot be edited by users.
     * @type {boolean}
     * @default false
     */

    _readOnly = false;

    @api
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
        this._updateProxyInputAttributes('readonly');
    }

    /**
     * If present, the input field must be filled out before the form is submitted.
     * @type {boolean}
     * @default false
     */

    _required = false;

    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes('required');
    }

    // ---- event management

    @api focus() {
        if (this._rendered) {
            this._inputElement.focus();
        }
    }

    @api blur() {
        if (this._rendered) {
            this._inputElement.blur();
        }
    }

    
    get _inputElement() {
        let inputElement = this.template.querySelector('input');
        this._inputDragonDecorated = true;
        decorateInputForDragon(inputElement);
        return inputElement;
    }


    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }


    // ---- event management

    _focused;

    handleFocusOut() {
        this._focused = false;
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleFocusIn() {
        if (!this._focused) {
            this.dispatchEvent(new CustomEvent('focus'));
        }

        this._focused = true;
    }



    handleChange(event) {
        let day = this.template.querySelector("input[name='day']");
        let month = this.template.querySelector("select[name='month']");
        let year = this.template.querySelector("input[name='year']");

        if (!day || !month || !year) {
            return;
        }

        if (day.value) {
            this._day = parseInt(day.value);
        }

        if (month.value) {
            this._month = parseInt(month.value);
        }

        if (year.value) {
            this._year = parseInt(year.value);
        }

        if (day.value && month.value && year.value) {
            this._value = new Date(Date.UTC(this._year, this._month - 1, this._day));
            //this._validate();
            this.dispatchChangeEvent();
        } else {
            this._value = undefined;
        }
    }

    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this.value,
                },
            })
        );
    }


    // ---- error

    _validate() {
        if (isAfter(this._value, this._max)) {
            this.showHelpMessage("Entry is too high");
        } else if (isBefore(this._value, this._min)) {
            this.showHelpMessage("Entry is too low");
        } else {
            this.showHelpMessage(null);
        }
    }



    // ---- errors

    _errorMessage;

    @api messageWhenValueMissing;

    _messageWhenBadInput;
    _messageWhenRangeOverflow;
    _messageRangeUnderflow;

    @api
    get messageWhenBadInput() {
        return (
            this._messageWhenBadInput ||
            formatLabel(this.i18n.invalidDate, this.dateFormat)
        );
    }
    set messageWhenBadInput(message) {
        this._messageWhenBadInput = message;
    }

    @api
    get messageWhenRangeOverflow() {
        return (
            this._messageWhenRangeOverflow ||
            formatLabel(this.i18n.rangeOverflow, this._displayMax)
        );
    }
    set messageWhenRangeOverflow(message) {
        this._messageWhenRangeOverflow = message;
    }

    @api
    get messageWhenRangeUnderflow() {
        return (
            this._messageWhenRangeUnderflow ||
            formatLabel(this.i18n.rangeUnderflow, this._displayMin)
        );
    }
    set messageWhenRangeUnderflow(message) {
        this._messageWhenRangeUnderflow = message;
    }

    @api
    showHelpMessage(message) {
        if (!message) {
            this._errorMessage = '';
        } else {
            this._errorMessage = message;
        }
    }

    @api
    hasBadInput() {
        //return this._value === null; // ESC
        return false;
    }

    get errorMessage() {
        return this._errorMessage;
    }


}