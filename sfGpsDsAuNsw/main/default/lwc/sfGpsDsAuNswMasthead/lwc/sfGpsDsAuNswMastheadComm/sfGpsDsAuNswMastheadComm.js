/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
const MASTHEADLABEL_DEFAULT = "A NSW Government website";
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswMastheadComm";
export default class sfGpsDsAuNswMastheadComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    arLabel = "Skip to links";
    // @ts-ignore
    @api
    nav;
    // @ts-ignore
    @api
    navLabel = "Skip to navigation";
    // @ts-ignore
    @api
    content;
    // @ts-ignore
    @api
    contentLabel = "Skip to content";
    // @ts-ignore
    @api
    cstyle;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    mastheadLabel;
    _mastheadLabelHtml = this.defineMarkdownContentProperty("mastheadLabel", {
        errorCode: "ML-MD",
        errorText: "Issue when parsing Masthead label markdown"
    });
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
    renderedCallback() {
        super.renderedCallback?.();
        const md = this.refs.markdown;
        if (this._mastheadLabelHtml.value && md) {
            replaceInnerHtml(md, this._mastheadLabelHtml.value);
        }
    }
}
