import { LightningElement, api, track } from 'lwc';
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSHeroBanner extends LightningElement {
    mdEngine = new NswDSMarkdown();


    // ---- titleLink: String in Markdown format

    _titleLink;
    @track _titleLabel;
    @track _titleUrl;

    @api set titleLink(markdown) {
        this._titleLink = markdown;

        try {
            const { url, text } = this.mdEngine.extractFirstLink(markdown);
            this._titleUrl = url;
            this._titleLabel = text;
        } catch(e) {
            console.log(e);
        }
    }

    get titleLink() {
        return this._titleLink;
    }


    // ---- imageSrc: String
    // ---- imageAlt: String

    @api imageSrc;
    @api imageAlt;


    // ---- content: String in Markdown format

    _content;
    _contentHtml;

    @api set content(markdown) {
        this._content = markdown;

        try {
            this._contentHtml = this.mdEngine.renderEscaped(markdown);
        } catch(e) {
            console.log(e);
        }
    }

    get content() {
        return this._content;
    }


    // ---- nswClass: String

    @api nswClass;



    // ---- rendered

    _rendered = false;

    renderedCallback() {
        if (this._rendered == false) {
            let element = this.template.querySelector(".nsw-hero-banner__content_internal");
            if (element) {
                element.innerHTML = this._contentHtml ? this._contentHtml : "";
            }

            this._rendered = true;
        }
    }

}