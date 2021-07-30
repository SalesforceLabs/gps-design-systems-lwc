import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from "c/nswUtilsPrivate";

export default class NswDSFooter extends LightningElement {
    @api statement = "We pay respect to the Traditional Custodians and First Peoples of NSW, and acknowledge their continued connection to their country and culture.";
    @api copyrightYear = new Date().getFullYear();

    static mdEngine = new NswDSMarkdown();

    // ---- links
    _links;
    @track _linkItems;

    @api get links() {
        return this._links;
    }
    
    set links(markdown) {
        markdown = normalizeString(markdown, { toLowerCase: false });
        this._links = markdown;

        try {
            this._linkItems = NswDSFooter.mdEngine.extractLinks(markdown);   
        } catch(e) {
            console.log(e);
        }
    }

    _copyrightMentionHtml;
    _copyrightMention;

    @api get copyrightMention() {
        return this._copyrightMention;
    }

    set copyrightMention(markdown) {
        markdown = normalizeString(markdown, { toLowerCase: false });
        this._copyrightMention = markdown;

        try {
            this._copyrightMentionHtml = NswDSFooter.mdEngine.renderEscaped(markdown);   
        } catch(e) {
            console.log(e);
        }

    }


    // ---- rendering

    _rendered = false;

    renderedCallback() {
        if (this._rendered == false) {
            let element = this.template.querySelector(".copyrightMention");
            if (element && this._copyrightMentionHtml) {
                element.innerHTML = this._copyrightMentionHtml;
                this._rendered = true;
            }
        }
    }

}