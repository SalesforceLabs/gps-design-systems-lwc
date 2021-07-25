import { LightningElement, api, track, wire } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";
import { getPicklistValues } from "lightning/uiObjectInfoApi";

const i18n = {
    picklistWireError: "Cannot retrieve picklist values"
}

export default class NswDSRadioGroupFromPicklist extends LightningElement {
    @api label;
    @api helper;
    @api name;
    @api isLegend = false;
    @api disabled = false;
    @api required = false;
    @api validateOnBlur;

    @api messageWhenValueMissing;


    // ---- options
    @api recordTypeId;
    @api fieldApiName;

    @track _options = [];

    @wire(getPicklistValues, { recordTypeId: "$recordTypeId", fieldApiName: "$fieldApiName" }) setOptions({ error, data }) {
        if (error) {
            let element = this.inputElement;
            if (element) {
                element.setCustomValidity(i18n.picklistWireError);
                element.reportValidity();
            } else {
                console.log(JSON.stringify(error));
            }
        } else if (data) {
            this._options =  data.values;
        }
    };


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
            (this._inputElement = this.template.querySelector("c-nsw-d-s-radio-group-base"));
    }


    // ---- Event Managemeent

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

    @api validate() {
        return this.inputElement.validate();
    }
}