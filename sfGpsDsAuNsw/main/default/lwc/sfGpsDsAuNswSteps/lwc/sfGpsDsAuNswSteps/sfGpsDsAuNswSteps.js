/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const CSTYLE_VALUES = {
    default: "",
    dark: "nsw-steps--dark",
    light: "nsw-steps--light",
    supplementary: "nsw-steps--supplementary"
};
const CSTYLE_DEFAULT = "default";
const SIZE_VALUES = {
    large: "",
    medium: "nsw-steps--medium",
    small: "nsw-steps--small"
};
const SIZE_DEFAULT = "large";
const FIRSTCHILD_DEFAULT = false;
export default class SfGpsDsAuNswSteps extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    type;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    // @ts-ignore
    firstChild;
    _firstChild = this.defineBooleanProperty("firstChild", {
        defaultValue: FIRSTCHILD_DEFAULT
    });
    // @ts-ignore
    @api
    cstyle;
    _cstyle = this.defineEnumObjectProperty("cstyle", {
        validValues: CSTYLE_VALUES,
        defaultValue: CSTYLE_DEFAULT
    });
    // @ts-ignore
    @api
    size;
    _size = this.defineEnumObjectProperty("size", {
        validValues: SIZE_VALUES,
        defaultValue: SIZE_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-steps": true,
            [this._cstyle.value]: !!this._cstyle.value,
            [this._size.value]: !!this._size.value,
            "nsw-steps--fill": this.type?.includes("fill"),
            "nsw-steps--counters": this.type?.includes("counter"),
            [this.className || ""]: !!this.className
        };
    }
}
