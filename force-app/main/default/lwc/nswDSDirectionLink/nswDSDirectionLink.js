import { LightningElement, api, track } from 'lwc';
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSDirectionLink extends LightningElement {
    static mdEngine = new NswDSMarkdown();

    @api iconName;
    @api nswClass;


    // -- titleLink: text in markdown format

    _titleLink;
    @track _titleLabel;
    @track _titleUrl;

    @api set titleLink(markdown) {
        this._titleLink = markdown;

        try {
            const { url, text } = NswDSDirectionLink.mdEngine.extractFirstLink(markdown);
            this._titleUrl = url;
            this._titleLabel = text;
        } catch(e) {
            console.log(e);
        }
    }

    get titleLink() {
        return this._titleLink;
    }
}