import { LightningElement, api, track } from "lwc";
import { normalizeBoolean, decorateInputForDragon, setDecoratedDragonInputValueWithoutEvent } from "c/nswUtilsPrivate"
import { InteractingState, FieldConstraintApiWithProxyInput, isEmptyString } from "c/nswInputUtils"
import { TouchScroller } from "c/nswTouchScrollLibrary";
import { generateUniqueId } from "c/nswInputUtils";

export default class NswDSTextAreaBase extends LightningElement {
    @api label="Text Area";
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;
    @api placeholder;
    @api accessKey;

    @api messageWhenBadInput;
    @api messageWhenTooShort;
    @api messageWhenTooLong;
    @api messageWhenValueMissing;

    @track _defaultValue = "";

    // ---- connected
    _connected = false;
    interactingState;

    connectedCallback() {
        this._connected = true;
        this.interactingState = new InteractingState();
    }

    disconnectedCallback() {
        this._connected = false;
    }

    // ---- rendered
    _rendered = false;

    renderedCallback() {
        if (!this._rendered) {
            this._rendered = true;
            this._setInputValue(this._defaultValue);

            const scrollTarget = this.template.querySelector(".textarea-container");
            this.touchScroller = new TouchScroller(scrollTarget);
        }
    }


    // ---- maxLength
    @track _maxLength = 255;

    @api get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        this._maxLength = value;
        this._updateProxyInputAttributes("maxlength");
    }


    // ---- minLength
    @track _minLength = 0;

    @api get minLength() {
        return this._minLength;
    }
    set minLength(value) {
        this._minLength = value;
        this._updateProxyInputAttributes("minlength");
    }


    // ---- value
    // TODO _value

    @api get value() {
        return this._value;
    }

    set value(value) {
        if (this._value !== value) {
            this._value = value || '';
            if (this._connected) {
                this._setInputValue(this._value);
            } else {
                this._defaultValue = this._value;
            }
        }
        this._updateProxyInputAttributes("value");
    }


    // ---- disabled
    @track _disabled = false;

    @api get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        this._updateProxyInputAttributes("disabled");
    }


    // ---- readOnly
    @track _readOnly = false;

    @api get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
        this._updateProxyInputAttributes("readonly");
    }


    // ---- required
    @track _required = false;

    @api get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes("required");
    }


    // ---- validity
    @api get validity() {
        return this._constraint.validity;
    }

    @api checkValidity() {
        return this._constraint.checkValidity();
    }

    @api setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    // ---- methods

    @api focus() {
        if (this._connected) {
            this.inputElement.focus();
        }
    }

    @api blur() {
        if (this._connected) {
            this.inputElement.blur();
        }
    }


    // ---- event management

    handleFocus() {
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent("focus"));
    }

    handleBlur() {
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent("blur"));
    }

    handleChange(event) {
        event.stopPropagation();
    }

    handleInput(event) {
        event.stopPropagation();

        if (!this._connected || this._value === event.target.value) {
            return;
        }

        this.interactingState.interacting();

        this._value = this.inputElement.value;
        this._updateProxyInputAttributes("value");

        this.dispatchEvent(
            new CustomEvent("change", {
                bubbles: true,
                composed: true,
                detail: {
                    value: this._value
                }
            })
        );
    }

    // ---- constraint

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApiWithProxyInput(() => this, {
                    valueMissing: () =>
                        this._required && isEmptyString(this._value),
                    tooShort: () =>
                        this._connected && this.inputElement.validity.tooShort,
                    tooLong: () =>
                        this._connected && this.inputElement.validity.tooLong
                },
                "textarea");

            this._constraintApiProxyInputUpdater = this._constraint.setInputAttributes({
                value: () => this.value,
                maxlength: () => this.maxLength,
                minlength: () => this.minLength,
                disabled: () => this.disabled,
                readonly: () => this.readOnly,
                required: () => this.required
            });
        }
        return this._constraintApi;
    }

    
    // ---- internal utilities

    get inputElement() {
        if (this._inputElement) {
            return this._inputElement;
        }

        this._inputElement = this.template.querySelector("textarea");
        decorateInputForDragon(this._inputElement);
        return this._inputElement;
    }

    _setInputValue(value) {
        setDecoratedDragonInputValueWithoutEvent(this.inputElement, value);
    }

    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }


    // ---- errorText: String

    _errorText = ""; // "Please select at least one option";

    get hasError() {
        return this._errorText ? this._errorText.length > 0 : false;
    }  
}

NswDSTextAreaBase.interopMap = {
    exposeNativeEvent: {
        change: true,
        focus: true,
        blue: true
    }
};
