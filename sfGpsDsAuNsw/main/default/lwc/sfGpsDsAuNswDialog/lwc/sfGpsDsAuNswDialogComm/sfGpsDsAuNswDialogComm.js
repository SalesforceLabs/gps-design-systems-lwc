/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswDialogComm";
export default class SfGpsDsAuNswDialogComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    primaryButtonText;
    // @ts-ignore
    @api
    secondaryButtonText;
    // @ts-ignore
    @api
    bstyle; // one of dark, danger
    // @ts-ignore
    @api
    isDismissible = false;
    // @ts-ignore
    @api
    className;
    _isOpen = false;
    // @ts-ignore
    @api
    content;
    _contentHtml = this.defineMarkdownContentProperty("content", {
        errorCode: "IN-MD",
        errorText: "Issue when parsing Content markdown."
    });
    /* computed */
    get computedButtonLabel() {
        return `Open ${this.title}`;
    }
    /* event management */
    // eslint-disable-next-line no-unused-vars
    handleClick(_event) {
        this._isOpen = true;
    }
    // eslint-disable-next-line no-unused-vars
    handleDismissed(_event) {
        this._isOpen = false;
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
    renderedCallback() {
        super.renderedCallback?.();
        if (this._contentHtml.value && this.refs.markdown) {
            replaceInnerHtml(this.refs.markdown, this._contentHtml.value);
        }
    }
}
