import { api, track } from "lwc";
import { InteractingState, FieldConstraintApi } from "c/nswInputUtils"
import { normalizeBoolean, normalizeString } from "c/nswUtilsPrivate"

const i18n = {
    messageWhenValueMissing: "This field is required",
    messageWhenTooShort: "Too few items selected",
    messageWhenTooLong: "Too many items selected"
}

function normalizeFormOptions(value) {
    if (Array.isArray(value)) {
        return value;
    }

    let items = value ? value.toString().trim() : "";
    let itemsA = [];

    try {
        itemsA = JSON.parse(items);
    } catch(err) {
        itemsA = (items == "" ? [] : items.split(";"));
    }

    return itemsA.map(option => ({
        label: (option instanceof Object ? option.label : option),
        value: (option instanceof Object ? option.value : option),
    })); 
}


const NswDSOptionsMixin = (base) =>
class extends base {

    // ---- validateOnBlur, set to false when in flow as it conflicts with flow validation
    
    _validateOnBlur = true;

    @api get validateOnBlur() {
        return this._validateOnBlur;
    }
    
    set validateOnBlur(value) {
        if (value !== undefined)
            this._validateOnBlur = value;
    }


    // ---- messageWhenValueMissing

    _messageWhenValueMissing

    @api get messageWhenValueMissing() {
        return this._messageWhenValueMissing || i18n.messageWhenValueMissing;
    }

    set messageWhenValueMissing(val) {
        this._messageWhenValueMissing = val;
    }


    // ---- messageWhenTooShort

    _messageWhenTooShort
    
    @api get messageWhenTooShort() {
        return this._messageWhenTooShort || i18n.messageWhenTooShort;
    }

    set messageWhenTooShort(val) {
        this._messageWhenTooShort = val;
    }


    // ---- messageWhenTooLong

    _messageWhenTooLong
    
    @api get messageWhenTooLong() {
        return this._messageWhenTooLong || i18n.messageWhenTooLong;
    }

    set messageWhenTooLong(val) {
        this._messageWhenTooLong = val;
    }


    // ---- options

    @track _options = [];

    @api get options() {
        return this._options;
    }
    
    set options(options) {
        this._options = normalizeFormOptions(options);
    }

    get _displayOptions() {
        const { options, value } = this;
        let itemIndex = 1;

        return options.map((option) => ({
            label: option.label,
            value: option.value,
            id: `option-${itemIndex++}`,
            isChecked: value.indexOf(option.value) >= 0
        }));
    }


    // ---- value

    @track _value = [];

    @api get value() {
        return this._value;
    }

    set value(v) { // Array of values or semicolon-separated String
        if (Array.isArray(v)) {
            this._value = v;
        } else {
            let items = v ? v.toString().trim() : "";
            this._value = (items == "" ? [] : items.split(";"));
        }
    }  


    // ---- maxLength

    @track _maxLength;

    @api get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        if (value === undefined || value === null || isNaN(value) || isNaN(parseInt(value))) {
            return;
        }

        this._maxLength = value;
        //this._updateProxyInputAttributes("maxlength");
    }


    // ---- minLength

    @track _minLength = 0;

    @api get minLength() {
        return this._minLength;
    }

    set minLength(value) {
        if (value === undefined || value === null || isNaN(value) || isNaN(parseInt(value))) {
            return;
        }

        this._minLength = value;
        //this._updateProxyInputAttributes("minlength");
    }


    // ---- disabled

    @track _disabled = false;

    @api get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }


    // ---- readOnly

    @track _readOnly = false;

    @api get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
    }
    

    // ---- required

    @track _required = false;

    @api get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }


    // ---- errorText

    _errorText = ""; // "Please select at least one option";
    
    @api get error() {
        return this._errorText;
    }

    set error(error) {
        this._errorText = normalizeString(error, { toLowerCase: false });
    }

    get hasError() {
        return this._errorText ? this._errorText.length > 0 : false;
    }


    // ---- validity

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled && this.required && this.value.length === 0,
                tooShort: () => !this.disabled && this.value.length < this.minLength,
                tooLong: () => !this.disabled && this.value.length > this.maxLength
            });
        }

        return this._constraintApi;
    }
    
    @api get validity() {
        return this._constraint.validity;
    }

    @api checkValidity() {
        return this._constraint.checkValidity();
    }

    @api reportValidity() {
        return this._constraint.reportValidity((message) => {
            this._errorText = message;
        });
    }

    @api setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    @api showHelpMessageIfInvalid() {
        this.reportValidity();
    }


    /**
     * For flow
     * @returns flow validation status
     */

    _flowErrorText = "";

    reportValidityFlow() {
        return this._constraint.reportValidity((message) => {
            this._flowErrorText = message;
        });
    }

    @api validate() {
        if (this.reportValidityFlow()) {
            return {
                isValid: true
            }
        } else {
            return {
                isValid: false,
                errorMessage: this._flowErrorText
            }
        }
    }
 

    // ---- interactingState

    _connected = false;
    interactingState;

    cbHook() {
        this._connected = true;
        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => { if (this._validateOnBlur) this.showHelpMessageIfInvalid(); });
    }

    dcHook() {
        this._connected = false;
    }
}


const NswDSOptionsFromRecordTypesMixin = (base) =>
class extends base {
    // ---- options
    @track _options = [];

    _setOptions(error, data) {
        if (error) {
            let element = this.inputElement;
            if (element) {
                element.setCustomValidity(this.i18n.recordTypeWireError);
                element.reportValidity();
            } else {
                console.log(JSON.stringify(error));
            }
        } else if (data) {
            let options = [];

            for (const rtId in data.recordTypeInfos) {
                let rt = data.recordTypeInfos[rtId];
                if (rt.available) {
                    options.push({
                        label: rt.name,
                        value: rt.recordTypeId
                    });
                }
            }

            this._options = options;
        }
    }
}


export {
    normalizeFormOptions,
    NswDSOptionsMixin,
    NswDSOptionsFromRecordTypesMixin
};