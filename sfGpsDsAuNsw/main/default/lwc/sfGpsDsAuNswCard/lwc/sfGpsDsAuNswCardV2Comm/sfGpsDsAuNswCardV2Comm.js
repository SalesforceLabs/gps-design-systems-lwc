/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswCardV2Comm";
/**
 * @slot Card-Copy
 * @slot Card-Footer
 */
export default class SfGpsDsAuNswCardV2Comm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    cstyle = "white";
    // @ts-ignore
    @api
    orientation = "vertical";
    // @ts-ignore
    @api
    dateStyle = "medium";
    // @ts-ignore
    @api
    headline;
    // @ts-ignore
    @api
    tag;
    // @ts-ignore
    @api
    image;
    // @ts-ignore
    @api
    imageAlt;
    // @ts-ignore
    @api
    preventDefault = false;
    // @ts-ignore
    @api
    className;
    // This is not exposed in Experience Builder and is used by cardCollectionComm
    // @ts-ignore
    @api
    useMarkup = false;
    // @ts-ignore
    @track
    _copySlotted = false;
    // @ts-ignore
    @track
    _footerSlotted = false;
    // @ts-ignore
    @api
    title = "";
    _title = this.defineMarkdownFirstLinkProperty("title", {
        errorCode: "TI-MD",
        errorText: "Issue when parsing Title markdown"
    });
    get _titleText() {
        return this._title.value?.text;
    }
    get _titleUrl() {
        return this._title.value?.url;
    }
    // @ts-ignore
    @api
    date;
    // @ts-ignore
    @api
    copy;
    _copyHtml = this.defineMarkdownContentProperty("copy", {
        errorCode: "CO-MD",
        errorText: "Issue when parsing Copy markdown"
    });
    // @ts-ignore
    @api
    footer;
    _footerHtml = this.defineMarkdownContentProperty("footer", {
        errorCode: "FO-MD",
        errorText: "Issue when parsing Footer markdown"
    });
    get highlight() {
        return this.cstyle === "highlight";
    }
    get computedCopyClassName() {
        return this._copySlotted
            ? "nsw-card__copy"
            : undefined;
    }
    get computedFooterClassName() {
        return this._copySlotted
            ? "nsw-card__footer"
            : undefined;
    }
    /* methods */
    // @ts-ignore
    @api
    click() {
        if (this.refs.card)
            this.refs.card.click();
    }
    /* event management */
    handleSlotChange(event) {
        if (DEBUG)
            console.debug(CLASS_NAME, "> handleSlotChange");
        const target = event.target;
        const an = target.assignedNodes();
        let emptyNode = true;
        /*
          Try and determine if it's an empty design node...
          very imperfect as further edits won't be detected, but at least it's good on reload
        */
        if (an.length) {
            const el = an[0];
            if (el.tagName?.startsWith("WEBRUNTIMEDESIGN")) {
                if (el.querySelector(".actualNode")) {
                    emptyNode = false;
                }
            }
            else {
                emptyNode = false;
            }
        }
        switch (target.name) {
            case "Card-Copy":
                this._copySlotted = !emptyNode;
                break;
            case "Card-Footer":
                this._footerSlotted = !emptyNode;
                break;
            default:
        }
        if (DEBUG)
            console.debug(CLASS_NAME, "< handleSlotChange");
    }
    handleNavigate(event) {
        this.dispatchEvent(new CustomEvent("navigate", {
            detail: event.detail
        }));
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
    renderedCallback() {
        super.renderedCallback?.();
        if (this._copyHtml.value && this.refs.copy) {
            replaceInnerHtml(this.refs.copy, this._copyHtml.value);
        }
        if (this._footerHtml.value && this.refs.footer) {
            replaceInnerHtml(this.refs.footer, this._footerHtml.value);
        }
    }
}
