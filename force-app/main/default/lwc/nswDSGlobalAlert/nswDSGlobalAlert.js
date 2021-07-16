import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from "c/nswUtilsPrivate";

export default class NswDSGlobalAlert extends LightningElement {
    mdEngine = new NswDSMarkdown();

    @api alertType = "default";
    @api title;
    @api content;
    

    get alertTypeClass() {
        return "nsw-sitewide-message" + ((this.alertType !== "" && this.alertType !== "default" ) ? " nsw-sitewide-message--" + this.alertType : "");
    }

    @api linkType = "none";


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

    
    get isLinkButton() {
        let lt = this.linkType.toString().toUpperCase();
        console.log('isLinkButton', lt, this._buttonLabel);
        return lt === 'BUTTON' && this._buttonLabel && this._buttonLabel.trim().length > 0;
    }

    get isLinkHref() {
        let lt = this.linkType.toString().toUpperCase();
        return lt === 'HREF' && this._buttonLabel && this._buttonLabel.trim().length > 0;
    }

    get space() {
        return " ";
    }

}