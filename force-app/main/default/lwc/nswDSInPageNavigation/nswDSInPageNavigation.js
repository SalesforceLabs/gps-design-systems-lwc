import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from "c/nswUtilsPrivate";

const i18n = {
    OnThisPage: "On this page"
}

export default class NswDSInPageNavigation extends LightningElement {
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
            this._linkItems = NswDSInPageNavigation.mdEngine.extractLinks(markdown);   
        } catch(e) {
            console.log(e);
        }
    }


    @api nswClass;

    get computedDivClass() {
        return "nsw-container" + this.nswClass ? " " + this.nswClass : "";
    }

    get i18n() {
        return i18n;
    }
}