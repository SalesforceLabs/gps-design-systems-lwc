/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswMediaComm";
/**
 * @slot Caption
 */
export default class sfGpsDsAuNswMediaComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    cstyle = "default";
    // @ts-ignore
    @api
    image;
    // @ts-ignore
    @api
    imageAlt;
    // @ts-ignore
    @api
    video;
    // @ts-ignore
    @api
    videoTitle;
    // @ts-ignore
    @api
    position;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    caption;
    _captiontHtml = this.defineMarkdownContentProperty("content", {
        errorCode: "CO-MD",
        errorText: "Issue when parsing Caption markdown"
    });
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
    renderedCallback() {
        super.renderedCallback?.();
        if (this._captiontHtml.value && this.refs.caption) {
            replaceInnerHtml(this.refs.caption, this._captiontHtml.value);
        }
    }
}
