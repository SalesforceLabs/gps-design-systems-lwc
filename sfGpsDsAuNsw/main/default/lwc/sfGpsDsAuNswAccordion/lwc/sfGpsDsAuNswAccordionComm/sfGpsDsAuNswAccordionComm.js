/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable no-unused-vars */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
const CLOSED_DEFAULT = true;
export default class SfGpsDsAuNswAccordionComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    index; // only used if part of a group
    // @ts-ignore
    @api
    header;
    // @ts-ignore
    @api
    content;
    // @ts-ignore
    @api
    className;
    // api: closed
    _closed = CLOSED_DEFAULT;
    // @ts-ignore
    @api
    get closed() {
        return this._closed;
    }
    set closed(value) {
        this._closed = value;
    }
    /* event management */
    handleExpand(_event) {
        this._closed = false;
        this.dispatchEvent(new CustomEvent("expand"));
    }
    handleCollapse(_event) {
        this._closed = true;
        this.dispatchEvent(new CustomEvent("collapse"));
    }
    /* lifecycle */
    renderedCallback() {
        super.renderedCallback?.();
        if (this.refs.markdown) {
            replaceInnerHtml(this.refs.markdown, this.content || "");
        }
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
