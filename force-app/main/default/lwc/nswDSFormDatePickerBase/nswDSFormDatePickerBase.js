import { LightningElement, api } from 'lwc';

import { normalizeBoolean, normalizeString, decorateInputForDragon, setDecoratedDragonInputValueWithoutEvent } from "c/nswUtilsPrivate"
import { InteractingState, generateUniqueId, FieldConstraintApiWithProxyInput } from "c/nswInputUtils"
import {
    isBefore,
    isAfter,
    parseDateTime,
} from 'c/nswInternationalizationLibrary';

import { STANDARD_DATE_FORMAT } from 'c/nswIso8601Utils';

export default class NswDSFormDatePickerBase extends LightningElement {
    @api label = "Date Input";
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;

    // ---- date/time

    _max;

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

    set max(newValue) {
        console.log('> set max');
        this._max = parseDateTime(newValue, STANDARD_DATE_FORMAT);
        this._validate();
        this._updateProxyInputAttributes('max');
    }

    
    /**
      * The minimum acceptable value for the input. Use this attribute with number,
      * range, date, time, and datetime input types only. For number and range types, the min value
      * is a decimal number. For the date, time, and datetime types, the min value must use a valid string for the type.
      * @type {decimal|string}
      */
    
    _min;

    @api
    get min() {
        return this._min;
    }

    set min(newValue) {
        console.log('> set min');
        this._min = parseDateTime(newValue, STANDARD_DATE_FORMAT);
        this._validate();
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
        console.log('> set value');
        this._value = parseDateTime(newValue, STANDARD_DATE_FORMAT);
        this._validate();
    }

    get day() {
        return this._value ? this._value.getDate() : this._day;
    }

    get month() {
        return this._value ? this._value.getMonth() + 1 : this._month;
    }

    get year() {
        return this._value ? this._value.getFullYear() : this._year;
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
        console.log('> set disabled');
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
        console.log('> set readOnly');
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
        console.log('> set required');
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes('required');
    }

    // ---- event management

    @api focus() {
        console.log('> focus');
        if (this._rendered) {
            this._inputElement.focus();
        }
    }

    @api blur() {
        console.log('> blur');
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
            this._validate();
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
    _errorText;

    _validate() {
        console.log('> _validate', this._value, this._min, this._max);
        if (isAfter(this._value, this._max)) {
            this._errorText = "Entry is too high.";
        } else if (isBefore(this._value, this._min)) {
            this._errorText = "Entry is too low.";
        } else {
            this._errorText = undefined;
        }
        console.log('< _validate');
    }
}