import { LightningElement, api } from 'lwc';

export default class NswDSAccordionItem extends LightningElement {
    @api title;
    @api content;
    @api isOpen = false;


    get computedButtonClass() {
        if (this.isOpen) {
            return "nsw-accordion__button is-open";
        }

        return "nsw-accordion__button";
    }

    // ---- Event Management

    handleClick() {
        this.isOpen = !this.isOpen;
    }


    // ---- rendering

    renderedCallback() {
        let element = this.template.querySelector(".nsw-wysiwyg-content");

        if (element) {
            element.innerHTML = this.content ? this.content : "";
        }
    }
}