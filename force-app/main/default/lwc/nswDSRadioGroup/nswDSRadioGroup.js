import { LightningElement, api, track } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";
import { normalizeFormOptions } from "c/nswDSFormUtils";

export default class NswDSRadioGroup extends LightningElement {
    @api label;
    @api helper;
    @api name;
    @api isLegend = false;
    @api disabled = false;
    @api required = false;
    @api validateOnBlur;
    
    @api messageWhenValueMissing;


    // ---- options

    @track _options = [];
    _optionsValue;

    @api get options() {
        let r = this._optionsValue;
        console.log('get options', JSON.stringify(r));
    }
    
    set options(options) {
        console.log('set options', JSON.stringify(options));
        this._optionsValue = options;
        this._options = normalizeFormOptions(options);
    }


    // ---- value
    
    @track _value = [];

    @api get value() {
        let r = this._value.join(";");
        console.log('get value', r);
        return r;
    }

    set value(v) {
        console.log('set value', JSON.stringify(v));
        let items = v ? v.toString().trim() : "";
        this._value = items == "" ? [] : items.split(";");
    }


    // ---- inputElement

    _inputElement;

    get inputElement() {
        return this._inputElement ||
            (this._inputElement = this.template.querySelector("c-nsw-d-s-radio-group-base"));
    }


    // ---- Event Management

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }


    // ---- flow validate
    
    @api validate() {
        return this.inputElement.validate();
    }
}