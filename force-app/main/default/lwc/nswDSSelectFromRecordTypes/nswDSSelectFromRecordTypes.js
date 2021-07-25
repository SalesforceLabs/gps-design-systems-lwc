import { LightningElement, api, track, wire } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";
import { NswDSOptionsFromRecordTypesMixin } from "c/nswDSFormUtils";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

const i18n = {
    recordTypeWireError: "Cannot retrieve record type values"
}

export default class NswDSSelectFromRecordTypes
extends NswDSOptionsFromRecordTypesMixin(LightningElement) {
    @api label;
    @api helper;
    @api name;
    @api isLegend = false;
    @api disabled = false;
    @api required = false;
    @api validateOnBlur;

    @api messageWhenValueMissing;

    @api objectApiName;

    @wire(getObjectInfo, { objectApiName: "$objectApiName" }) setOptions({ error, data }) {
        this._setOptions(error, data);
    };

    get i18n() {
        return i18n;
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


    // ---- element

    _inputElement;

    get inputElement() {
        return this._inputElement ||
            (this._inputElement = this.template.querySelector("c-nsw-d-s-select-base"));
    }


    // --- event management


    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            this._valueValue = this._value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }


    // ---- flow validate
    
    @api validate() {
        return inputEment.validate();
    }
}