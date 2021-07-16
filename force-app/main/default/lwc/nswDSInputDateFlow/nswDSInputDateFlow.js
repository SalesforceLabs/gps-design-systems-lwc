import { LightningElement, api } from "lwc";
import { generateUniqueId } from "c/nswInputUtils";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSInputDateFlow extends LightningElement {
    @api label="Text Input";
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api dateStyle = "medium";

    // ---- max
    _max;

    @api get max() {
        return typeof(this._max) === "undefined" ? null : new Date(this._max);
    }
    
    set max(newValue) {
        console.log('set max', newValue, typeof newValue);
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
        console.log('set min', newValue);
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

    @api disabled = false;
    @api readOnly = false;
    @api required = false;

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

}
