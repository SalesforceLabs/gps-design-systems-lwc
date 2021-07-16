import { LightningElement, api, track } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSCheckboxGroupFlow extends LightningElement {
    @api label;
    @api helper;
    @api name;
    @api isLegend = false;

    // ---- options
    @track _options = [];
    _optionsValue;

    @api get options() {
        return this._optionsValue;
    }
    
    set options(options) {
        console.log("options", JSON.stringify(options));
        this._optionsValue = options;

        let items = options ? options.toString().trim() : "";
        let itemsA = [];
        
        try {
            itemsA = JSON.parse(items);
        } catch(err) {
            itemsA = items == "" ? [] : items.split(";");
        }
    
        let index = 1;
        this._options =  itemsA.map(option => ({
            label: (option instanceof Object ? option.label : option),
            value: (option instanceof Object ? option.value : option),
            id: `checkbox-${index++}`,
            isChecked: this._value.indexOf(option.value) !== -1
        })); 
    }

    
    // ---- value
    @track _value = [];
    _valueValue = "";

    @api get value() {
        return this._valueValue;
    }

    set value(v) {
        this._valueValue = v;

        let items = v ? v.toString().trim() : "";
        this._value = items == "" ? [] : items.split(";");
    }


    @api disabled = false;
    @api required = false;


    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            this._valueValue = this._value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

}