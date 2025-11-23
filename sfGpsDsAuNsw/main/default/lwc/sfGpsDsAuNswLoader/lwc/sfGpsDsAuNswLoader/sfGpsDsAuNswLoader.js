/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const SIZE_DEFAULT = "xl";
const SIZE_VALUES = {
    xl: "",
    lg: "nsw-loader__circle--lg",
    md: "nsw-loader__circle--md",
    sm: "nsw-loader__circle--sm"
};
export default class SfGpsDsAuNswLoader extends SfGpsDsElement {
    // @ts-ignore
    @api
    label;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    size;
    _size = this.defineEnumObjectProperty("size", {
        validValues: SIZE_VALUES,
        defaultValue: SIZE_DEFAULT
    });
    /* computed */
    get computedSpanClassName() {
        return {
            "nsw-loader__circle": true,
            [this._size.value]: this._size.value
        };
    }
    get computedClassName() {
        return {
            "nsw-loader": true,
            [this.className || ""]: !!this.className
        };
    }
}
