import { LightningElement, api, track } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import { normalizeFormOptions } from "c/nswDSFormUtils";

export default class NswDSSelect extends LightningElement {
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
        return this._optionsValue;
    }
    
    set options(options) {
        this._optionsValue = options;
        this._options = normalizeFormOptions(options);
    }


    // ---- value
    @track _value = [];

    @api get value() {
        return this._value.join(";");
    }

    set value(v) {
        let items = v ? v.toString().trim() : "";
        this._value = items == "" ? [] : items.split(";");
    }


    // ---- inputElement

    _inputElement;

    get inputElement() {
        return this._inputElement ||
            (this._inputElement = this.template.querySelector("c-nsw-d-s-select-base"));
    }


    // ---- Event Management

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent('value', this._value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

    
    // ---- flow validate
    
    @api validate() {
        return this.inputElement.validate();
    }

}