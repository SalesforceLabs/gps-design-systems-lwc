import { LightningElement, api, track } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class NswDSSelectFlow extends LightningElement {
    @api label = "Select";
    @api helper;
    @api name;
    @api isLegend = false;


    // ---- options
    @track _options = [];
    _optionsValue = "";

    @api get options() {
        return this._optionsValue;
    }
    
    set options(options) {
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
            id: `option-${index++}`,
            isChecked: this._value == option.value
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

        let items = v ? v.toString() : "";
        this._value = items;
    }


    @api disabled = false;
    @api required = false;


    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            this._valueValue = this._value;

            const attributeChangeEvent = new FlowAttributeChangeEvent('value', this._value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }
}