import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from 'c/nswUtilsPrivate';

export default class NswDSBanner extends LightningElement {
    static mdEngine = new NswDSMarkdown();

    @api isDark = false;
    @api isWide = false;
    @api title;
    @api subtitle;
    @api imageSrc;
    @api imageAlt;
    @api nswClass;

    get computedBannerClass() {
        return (this.isDark ? " nsw-banner--dark" : "")
                + (this.isWide ? " nsw-banner--wide" : "")
                + (this.nswClass ? " " + this.nswClass : "");
    }


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
            this._linksHtml = NswDSBanner.mdEngine.renderLinks(markdown);   
        } catch(e) {
            console.log(e);
        }
    }

    get hasLinks() {
        return this._linksHtml != null;
    }


    // ---- content

    _content;
    _contentHtml;

    @api get content() {
        return this._content;
    }
    
    set content(markdown) {
        this._content = normalizeString(markdown, { toLowerCase: false });

        try {
            this._contentHtml = NswDSBanner.mdEngine.render(markdown.replaceAll("\\n", "\n"));
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
        this._buttonLink = normalizeString(markdown, { toLowerCase: false });

        try {
            const { url, text } = NswDSBanner.mdEngine.extractFirstLink(markdown);
            this._buttonUrl = url;
            this._buttonLabel = text;
         } catch(e) {
             console.log(e);
         }
     }


    // ---- rendering

    _rendered = false;

    renderedCallback() {
        if (this._rendered == false) {
            let element = this.template.querySelector(".banner-links-placeholder");
            if (element) {
                element.innerHTML = this._linksHtml ? this._linksHtml : "";
            }

            element = this.template.querySelector(".banner-content-placeholder");
            if (element) {
                element.innerHTML = this._contentHtml ? this._contentHtml : "";
            }

            this._rendered = true;
        }
    }
}