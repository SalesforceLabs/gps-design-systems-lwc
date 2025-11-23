/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const CSTYLE_DEFAULT = "default";
const CSTYLE_VALUES = {
    default: { skip: "", masthead: "" },
    light: { skip: "nsw-skip--light", masthead: "nsw-masthead--light" }
};
export default class SfGpsDsAuNswMasthead extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    arLabel = "Skip to links";
    // @ts-ignore
    @api
    navLabel = "Skip to navigation";
    // @ts-ignore
    @api
    contentLabel = "Skip to content";
    // @ts-ignore
    @api
    content;
    // @ts-ignore
    @api
    nav;
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
    get computedSkipClassName() {
        return {
            "nsw-skip": true,
            [this._cstyle.value.skip]: this._cstyle.value.skip
        };
    }
    get computedMastheadClassName() {
        return {
            "nsw-masthead": true,
            [this._cstyle.value.masthead]: this._cstyle.value.masthead,
            [this.className || ""]: !!this.className
        };
    }
}
