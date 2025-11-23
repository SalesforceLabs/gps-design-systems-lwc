/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const CSTYLE_VALUES = {
    default: "",
    custom: "nsw-footer--custom",
    dark: "nsw-footer--dark",
    light: "nsw-footer--light"
};
const CSTYLE_DEFAULT = "default";
export default class SfGpsDsAuNswFooterCoom extends SfGpsDsLwc {
    // @ts-ignore
    @api
    upperFooterMode = "Integration Procedure";
    // @ts-ignore
    @api
    upperFooterNavigationDevName;
    // @ts-ignore
    @api
    upperFooterIpName;
    // @ts-ignore
    @api
    upperFooterInputJSON;
    // @ts-ignore
    @api
    upperFooterOptionsJSONN;
    // @ts-ignore
    @api
    upperFooterClassName;
    // @ts-ignore
    @api
    mode = "Integration Procedure";
    // @ts-ignore
    @api
    navigationDevName;
    // @ts-ignore
    @api
    ipName;
    // @ts-ignore
    @api
    inputJSON;
    // @ts-ignore
    @api
    optionsJSON;
    // @ts-ignore
    @api
    statement;
    // @ts-ignore
    @api
    linkedInUrl;
    // @ts-ignore
    @api
    twitterXUrl;
    // @ts-ignore
    @api
    facebookUrl;
    // @ts-ignore
    @api
    copyrightMention;
    // @ts-ignore
    @api
    builtMention;
    // @ts-ignore
    @api
    lowerFooterClassName;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    cstyle;
    _cstyle = this.defineEnumObjectProperty("cstyle", {
        validValues: CSTYLE_VALUES,
        defaultValue: CSTYLE_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-footer": true,
            [this._cstyle.value]: !!this._cstyle.value,
            [this.className || ""]: !!this.className
        };
    }
    get computedShowUpperFooter() {
        return this.upperFooterMode !== "Hide";
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
