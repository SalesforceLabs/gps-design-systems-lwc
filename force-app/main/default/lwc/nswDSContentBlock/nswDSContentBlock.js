import { LightningElement, api, track } from 'lwc';
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from 'c/nswUtilsPrivate';

export default class NswDSContentBlock extends LightningElement {
    static mdEngine = new NswDSMarkdown();

    // ---- links
    _links;
    _linksHtml;

    @api get links() {
        return this._links;
    }
    
    set links(markdown) {
        markdown = normalizeString(markdown, { toLowerCase: false });
        this._links = markdown;

        try {
            this._linksHtml = NswDSContentBlock.mdEngine.renderLinks(markdown);   
        } catch(e) {
            console.log(e);
        }
    }


    // ---- content

    _content;
    _contentHtml;

    @api get content() {
        return this._content;
    }

    set content(markdown) {
        markdown = normalizeString(markdown, { toLowerCase: false });
        this._content = markdown;

        try {
            this._contentHtml = NswDSContentBlock.mdEngine.renderEscaped(markdown);
        } catch(e) {
            console.log(e);
        }
    }

    
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
           const { url, text } = NswDSContentBlock.mdEngine.extractFirstLink(markdown);
           this._buttonUrl = url;
           this._buttonLabel = text;
        } catch(e) {
            console.log(e);
        }
    }


    // ---- title
    
    _title;

    @api get title() {
        return this._title;
    }

    set title(newValue) {
        this._title = normalizeString(newValue, { toLowerCase: false });
    }


    // ---- imageSrc

    _imageSrc;

    @api get imageSrc() {
        return this._imageSrc;
    }

    set imageSrc(newValue) {
        this._imageSrc = normalizeString(newValue);
    }


    // ---- imageAlt

    _imageAlt;

    @api get imageAlt() {
        return this._imageAlt;
    }

    set imageAlt(newValue) {
        this._imageAlt = normalizeString(newValue, { toLowerCase: false });
    }


    // ---- nswClass

    @api nswClass;


    // ---- rendering

    _rendered = false;

    renderedCallback() {
        if (this._rendered == false) {
            let element = this.template.querySelector(".nsw-content-block__list");
            if (element && this._linksHtml) {
                console.log('adding block list', this._linksHtml);
                element.innerHTML = this._linksHtml;
            }

            element = this.template.querySelector(".nsw-content-block__copy");
            if (element && this._contentHtml) {
                element.innerHTML = this._contentHtml;
            }

            this._rendered = true;
        }
    }

}