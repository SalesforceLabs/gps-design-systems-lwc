import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const LINKS_DEFAULT = [];
export default class SfGpsDsAuVic2DocsPageHeaderLwr extends SfGpsDsLwc {
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    description;
    // @ts-ignore
    @api
    links;
    _links = this.defineMarkdownLinksProperty("links", {
        errorCode: "LI-MD",
        errorText: "Issue when parsing Links markdown",
        defaultValue: LINKS_DEFAULT
    });
    /* computed */
    get computedShowLinks() {
        return !!this._links.value?.length;
    }
    /* lifecycle */
    constructor() {
        super(true); // isLwrOnly
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("vic2-scope");
    }
}
