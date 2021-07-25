import { LightningElement, api, track } from "lwc";
import { NswDSOptionsMixin } from "c/nswDSFormUtils";
import { generateUniqueId } from "c/nswInputUtils";

export default class NswDSCheckboxGroupBase
extends NswDSOptionsMixin(LightningElement) {
    static delegatesFocus = true;

    @api label;
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;


    connectedCallback() {
        this.cbHook();
    }

    disconnectCallback() {
        this.dcHook();
    }


    // ---- methods

    @api focus() {
        const firstCheckbox = this.template.querySelector("input");
        if (firstCheckbox) {
            firstCheckbox.focus();
        }
    }


    // ---- event management

    handleFocus() {
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent("focus"));
    }

    handleBlur() {
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent("blur"));
    }
    
    handleClick(event) {
        if (this.template.activeElement !== event.target) {
            event.target.focus();
        }
    }

    handleChange(event) {
        event.stopPropagation();
        this.interactingState.interacting();

        const checkboxes = this.template.querySelectorAll("input");
        const value = Array.from(checkboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        this._value = value;

        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { value },
                composed: true,
                bubbles: true,
                cancelable: true
            })
        );
    }  
}