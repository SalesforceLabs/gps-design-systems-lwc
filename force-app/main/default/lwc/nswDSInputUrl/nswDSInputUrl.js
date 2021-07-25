import { LightningElement, api } from "lwc";
import { generateUniqueId } from "c/nswInputUtils";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSInputUrl extends LightningElement {
    @api label;
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api pattern;
    @api maxInputLength; /* there is a bug with flows when mapping maxLength, so use this instead */
    @api minInputLength; /* there is a bug with flows when mapping minLength, so use this instead */
    @api value;
    @api disabled = false;
    @api readOnly = false;
    @api required = false;
    @api validateOnBlur;
    
    @api messageWhenTypeMismatch;
    @api messageWhenPatternMismatch;
    @api messageWhenTooLong;
    @api messageWhenTooShort;
    @api messageWhenValueMissing;

    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this.value = event.detail.value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

    @api validate() {
        let element = this.template.querySelector("c-nsw-d-s-input-base");
        return element.validate();
    }
}
