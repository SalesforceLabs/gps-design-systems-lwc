import { LightningElement, api, track } from "lwc";
import { NswDSOptionsMixin } from "c/nswDSFormUtils";
import { generateUniqueId } from "c/nswInputUtils";

export default class NswDSRadioGroupBase
extends NswDSOptionsMixin(LightningElement) {
    static delegatesFocus = true;

    @api label;
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;


    connectedCallback() {
        console.log('connect');
        this.cbHook();
    }

    disconnectCallback() {
        console.log('disconnect');
        this.dcHook();
    }


    // ---- methods

    @api focus() {
        console.log('focus')
        const firstRadio = this.template.querySelector("input");
        if (firstRadio) {
            firstRadio.focus();
        }
    }


    // ---- event management

    handleFocus(event) {
        console.log('handleFocus', event.target.id, this.template.activeElement.id, this.interactingState.isInteracting());
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent("focus"));
    }

    handleBlur(event) {
        console.log('handleBlur', event.target.id, this.template.activeElement ? this.template.activeElement.id : 'nada', this.interactingState.isInteracting());
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent("blur"));
    }
    
    handleClick(event) {
        console.log('handleClick', JSON.stringify(this.template.activeElement.id), JSON.stringify(event.target.id))
        if (this.template.activeElement !== event.target) {
            console.log('click focus');
            event.target.focus();
        }
    }

    handleChange(event) {
        event.stopPropagation();
        this.interactingState.interacting();

        const value = [ event.target.value ];
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