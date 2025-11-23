/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";
const LINK_DEFAULT = {
    text: undefined,
    url: undefined
};
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswButtonComm";
export default class SfGpsDsAuNswButtonComm extends NavigationMixin(SfGpsDsLwc) {
    // @ts-ignore
    @api
    type;
    // @ts-ignore
    @api
    iconName;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    cstyle;
    // @ts-ignore
    @api
    iconStyle;
    // @ts-ignore
    @api
    rendering;
    // @ts-ignore
    @api
    disabled = false;
    // @ts-ignore
    @api
    mobileFullWidth = false;
    // @ts-ignore
    @api
    link;
    _link = this.defineMarkdownFirstLinkProperty("link", {
        errorCode: "ML-MD",
        errorText: "Issue when parsing Link markdown"
    });
    /* computed */
    get computedIsButton() {
        return this.rendering === "button";
    }
    /* event management */
    // eslint-disable-next-line no-unused-vars
    handleClick(_event) {
        if (this._link.value?.url) {
            // @ts-ignore
            this[NavigationMixin.Navigate]({
                type: "standard__webPage",
                attributes: {
                    url: this._link.value?.url
                }
            });
        }
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
