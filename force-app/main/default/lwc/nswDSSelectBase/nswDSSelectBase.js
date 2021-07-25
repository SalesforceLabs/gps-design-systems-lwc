import { LightningElement, api, track } from "lwc";
import { NswDSOptionsMixin } from "c/nswDSFormUtils";
import { generateUniqueId } from "c/nswInputUtils";

export default class NswDSSelectBase
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
        const firstOption = this.inputElement;
        if (firstOption) {
            firstOption.focus();
        }
    }


    // ---- inputElement

    _inputElement;

    get inputElement() {
        return this._inputElement ||
            (this._inputElement = this.template.querySelector("select"));
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
    
    handleChange(event) {
        event.stopPropagation();
        this.interactingState.interacting();

        const value = event.target.value;
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