import { LightningElement, api } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSTextAreaFlow extends LightningElement {
    @api label="Text Area";
    @api name;
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api value = "";
    @api required = false;
    @api readOnly = false;
    @api disabled = false;
    @api minInputLength = 0;
    @api maxInputLength = 255;

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this.value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }
}