import { LightningElement, api } from 'lwc';
import { generateUniqueId } from "c/nswInputUtils";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class NswDSInputToggle extends LightningElement {
    @api label;
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api value = false;
    @api messageToggleActive = "Active";
    @api messageToggleInactive = "Inactive";
    @api disabled = false;
    @api readOnly = false;
    @api required = false;
    @api validateOnBlur;

    @api messageWhenValueMissing;


    handleChange(event) {
        if (event.detail.hasOwnProperty("checked")) {
            this.value = event.detail.checked;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }

    @api validate() {
        let element = this.template.querySelector("c-nsw-d-s-input-base");
        return element.validate();
    }
}
