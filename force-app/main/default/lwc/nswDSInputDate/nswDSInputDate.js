import { LightningElement, api } from "lwc";
import { generateUniqueId } from "c/nswInputUtils";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSInputDate extends LightningElement {
    @api label;
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api dateStyle = "medium";
    @api disabled = false;
    @api readOnly = false;
    @api required = false;
    @api validateOnBlur;

    @api messageWhenBadInput;
    @api messageWhenValueMissing;
    @api messageWhenRangeOverflow;
    @api messageWhenRangeUnderflow;

    // ---- i18n

    get i18n() {
        return i18n;
    }

    // ---- max
    _max;

    @api get max() {
        return typeof(this._max) === "undefined" ? null : new Date(this._max);
    }
    
    set max(newValue) {
        if (newValue instanceof Date) {
            this._max = newValue.toISOString();
        } else {
            this._max = newValue;
        }
    }


    // ---- min
    _min;

    @api get min() {
        return typeof(this._min) === "undefined" ? null : new Date(this._min);
    }
    
    set min(newValue) {
        if (newValue instanceof Date) {
            this._min = newValue.toISOString();
        } else {
            this._min = newValue;
        }
    }


    // ---- value
    _value;

    @api get value() {
        return typeof(this._value) === "undefined" ? null : new Date(this._value);
    }

    set value(newValue) {
        if (newValue instanceof Date) {
            this._value = newValue.toISOString();
        } else {
            this._value = newValue;
        }
    }

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

    @api validate() {
        let element = this.template.querySelector("c-nsw-d-s-input-base");
        return element.validate();
    }
}
