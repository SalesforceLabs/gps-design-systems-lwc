import { LightningElement, api, track } from 'lwc';
import { normalizeString } from "c/nswUtilsPrivate";

export default class NswDSButtonBase extends LightningElement {
    @api buttonLabel;
    @api buttonUrl;
    @api rendering = "HREF";
    @api actionType = "button";
    @api buttonType = "primary"; // primary, outline, highlight, white
    @api nswClass;

    get buttonClass() {
        return "nsw-button nsw-button--" + this.buttonType + (this.nswClass ? " " + this.nswClass : "");
    }

    get isLinkButton() {
        return this.rendering.toUpperCase() == "HREF";
    }

    get isActionButton() {
        return this.rendering.toUpperCase() == "ACTION";
    }

    get isInputButton() {
        return this.rendering.toUpperCase() == "INPUT";
    }

    handleClick(event) {
        this.dispatchEvent(
            new CustomEvent("click", {
                detail: { value: "click" },
            }));
    }

}