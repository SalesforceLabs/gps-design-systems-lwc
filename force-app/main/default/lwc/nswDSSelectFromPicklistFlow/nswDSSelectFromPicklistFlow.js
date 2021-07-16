import { LightningElement, api, track, wire } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";
import { getPicklistValues } from "lightning/uiObjectInfoApi";

export default class NswDSSelectFromPicklistFlow extends LightningElement {
    @api label = "Select";
    @api helper;
    @api name;
    @api isLegend = false;


    // ---- options
    @api recordTypeId;
    @api fieldApiName;

    @track _options = [];
    _optionsValue;

    @wire(getPicklistValues, { recordTypeId: "$recordTypeId", fieldApiName: "$fieldApiName" }) setOptions({ error, data }) {
        if (error) {
            this.error = "Cannot retrieve picklist values"
        } else if (data) {
            let index = 1;
            this._options =  data.values.map(option => ({
                label: option.label,
                value: option.value,
                id: `option-${index++}`,
                isChecked: this._value.indexOf(option.value) !== -1
            })); 
        }
    };


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
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
            }
    }
}