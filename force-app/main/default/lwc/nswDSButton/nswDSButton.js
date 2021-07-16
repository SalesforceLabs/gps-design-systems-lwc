import { LightningElement, api, track } from 'lwc';
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from "c/nswUtilsPrivate";

export default class NswDSButton extends LightningElement {
    mdEngine = new NswDSMarkdown();


    // ---- buttonLink

    _buttonLink;
    @track _buttonLabel;
    @track _buttonUrl;

    @api get buttonLink() {
        return this._buttonLink;
    }

    set buttonLink(markdown) {
        markdown = normalizeString(markdown, { toLowerCase: false });
        this._buttonLink = markdown;

        try {
           const { url, text } = this.mdEngine.extractFirstLink(markdown);
           this._buttonUrl = url;
           this._buttonLabel = text;
        } catch(e) {
            console.log(e);
        }
    }

    @api rendering = "HREF";
    @api actionType = "button";
    @api buttonType = "primary"; // primary, outline, highlight, white
    @api nswClass;
}