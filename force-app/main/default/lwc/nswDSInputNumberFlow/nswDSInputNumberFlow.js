import { LightningElement, api } from "lwc";
import { generateUniqueId } from "c/nswInputUtils";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSInputNumberFlow extends LightningElement {
    @api label="Number Input";
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api formatter;
    @api min;
    @api max;
    @api step;
    @api value;
    @api disabled = false;
    @api readOnly = false;
    @api required = false;

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this.value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }
}