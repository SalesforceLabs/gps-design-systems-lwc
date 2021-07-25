import { LightningElement, api } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSTextAreaFlow extends LightningElement {
    @api label;
    @api name;
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api value;
    @api required = false;
    @api readOnly = false;
    @api disabled = false;
    @api minInputLength;
    @api maxInputLength;
    @api validateOnBlur;

    @api messageWhenBadInput;
    @api messageWhenTooShort;
    @api messageWhenTooLong;
    @api messageWhenValueMissing;


    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this.value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }
}