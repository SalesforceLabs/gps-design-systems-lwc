import { LightningElement, api, track } from "lwc";

export default class NswDSRadioGroupComm extends LightningElement {
    @api label = "Radio Group";
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
            id: `radio-${index++}`,
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

        let items = v ? v.toString() : "";
        this._value = items;
    }


    @api disabled = false;
    @api required = false;


    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            this._valueValue = this._value;
        }
    }
}