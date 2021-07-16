import { LightningElement, api, track } from "lwc";
import { InteractingState, FieldConstraintApi, generateUniqueId } from "c/nswInputUtils";
import { normalizeBoolean } from "c/nswUtilsPrivate";

const NO_ITEM_ERR = "This component has not been configured with any item";

export default class NswDSCheckboxGroupBase extends LightningElement {
    static delegatesFocus = true;

    @api label;
    @api options = [];
    @api messageWhenValueMissing;
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;


    // ---- interactingState
    interactingState;

    connectedCallback() {
        this.interactingState = new InteractingState();
        //this.interactingState.onleave(this.showHelpMessageIfInvalid.bind(this));
    }


    // ---- value
    _value = [];

    @api get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
    }
    

    // ---- disabled
    @track _disabled = false;

    @api get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
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
    _errorText; // "Please select at least one option";

    @api get error() {
        return this._errorText;
    }

    set error(error) {
        this._errorText = error;
    }
    
    get hasError() {
        return this._errorText ? this._errorText.length > 0 : false;
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
        const firstCheckbox = this.template.querySelector("input");
        if (firstCheckbox) {
            firstCheckbox.focus();
        }
    }

    // ---- internal utilities

    get transformedOptions() {
        const { options, value } = this;
        let itemIndex = 1;

        if (Array.isArray(options)) {
            return options.map((option) => ({
                label: option.label,
                value: option.value,
                id: `checkbox-${itemIndex++}`,
                isChecked: value.indexOf(option.value) !== -1
            }));
        } 

        return [];
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
    
    handleClick(event) {
        if (this.template.activeElement !== event.target) {
            event.target.focus();
        }
    }

    handleChange(event) {
        event.stopPropagation();

        this.interactingState.interacting();

        const checkboxes = this.template.querySelectorAll("input");
        const value = Array.from(checkboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        this._value = value;

        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { value },
                composed: true,
                bubbles: true,
                cancelable: true
            })
        );
    }    


    // ---- constraint

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled && this.required && this.value.length === 0
            });
        }
        return this._constraintApi;
    }
}