import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSListItem extends LightningElement {
    mdEngine = new NswDSMarkdown();

    @api isReversed = false;
    @api content;
    @api tag;
    @api imageSrc;
    @api imageAlt;
    @api dateIso;
    @api date; // not public in Community
    @api nswClass;


    // -- titleLink: text in markdown format

    _titleLink;
    @track _titleLabel;
    @track _titleUrl;

    @api get titleLink() {
        return this._titleLink;
    }

    set titleLink(markdown) {
        this._titleLink = markdown;

        try {
            const { url, text } = this.mdEngine.extractFirstLink(markdown);
            this._titleUrl = url;
            this._titleLabel = text;
        } catch(e) {
            console.log(e);
        }
    }
    

    // ---- tags

    @api tags;

}