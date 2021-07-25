import { LightningElement, api } from "lwc";
import { generateUniqueId } from "c/nswInputUtils";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSInputTime extends LightningElement {
    @api label;
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api timeStyle = "short";
    @api min;
    @api max;
    @api value;
    @api disabled = false;
    @api readOnly = false;
    @api required = false;
    @api validateOnBlur;

    @api messageWhenRangeUnderflow;
    @api messageWhenRangeOverflow;
    @api messageWhenValueMissing;
    @api messageWhenBadInput;

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

    @api validate() {
        let element = this.template.querySelector("c-nsw-d-s-input-base");
        return element.validate();
    }
}
