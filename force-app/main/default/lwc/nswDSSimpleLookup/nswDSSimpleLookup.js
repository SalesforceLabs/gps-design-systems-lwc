import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSSimpleLookup extends LightningElement {
    @api label;
    @api isLegend = false;
    @api helper;
    @api name;
    @api inputText = "";
    @api placeholder;
    @api disabled = false;
    @api required = false;
    @api validateOnBlur;

    @api messageWhenValueMissing;

    @api sldsIconName;
    @api objectApiName;
    @api mainFieldApiName;
    @api secondaryFieldApiName;
    @api valueFieldApiName;
    @api nRows = 256;

    @api value;

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            this._valueValue = this._value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }


    // ---- element

    _inputElement;

    get inputElement() {
        return this._inputElement ||
            (this._inputElement = this.template.querySelector("c-nsw-d-s-simple-lookup-base"));
    }

}