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
    dark: "nsw-media--dark",
    light: "nsw-media--light",
    transparent: "nsw-media--transparent"
};
const CSTYLE_DEFAULT = "default";
const POSITION_VALUES = {
    default: "",
    "60": "nsw-media--60",
    "70": "nsw-media--70",
    "80": "nsw-media--80",
    "90": "nsw-media--90",
    "left-30": "nsw-media--left-30",
    "left-40": "nsw-media--left-40",
    "left-50": "nsw-media--left-50",
    "right-30": "nsw-media--right-30",
    "right-40": "nsw-media--right-40",
    "right-50": "nsw-media--right-50"
};
const POSITION_DEFAULT = "default";
export default class SfGpsDsAuNswMedia extends SfGpsDsElement {
    static renderMode = "light";
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
    caption;
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
    // @ts-ignore
    @api
    position;
    _position = this.defineEnumObjectProperty("position", {
        validValues: POSITION_VALUES,
        defaultValue: POSITION_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-media": true,
            [this._cstyle.value]: this._cstyle.value,
            [this._position.value]: this._position.value,
            [this.className || ""]: !!this.className
        };
    }
}
