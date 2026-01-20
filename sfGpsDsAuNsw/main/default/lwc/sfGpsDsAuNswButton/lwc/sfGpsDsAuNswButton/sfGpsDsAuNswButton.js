/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const CSTYLE_VALUES = [
    "dark",
    "dark-outline",
    "dark-outline-solid",
    "light",
    "light-outline",
    "white",
    "danger",
    "info"
];
const CSTYLE_DEFAULT = "dark";
const ICONSTYLE_NONE = "none";
const ICONSTYLE_BEFORE = "before";
const ICONSTYLE_AFTER = "after";
const ICONSTYLE_VALUES = [ICONSTYLE_AFTER, ICONSTYLE_BEFORE, ICONSTYLE_NONE];
const ICONSTYLE_DEFAULT = ICONSTYLE_NONE;
const RENDERING_A = "a";
const RENDERING_BUTTON = "button";
const RENDERING_VALUES = [RENDERING_A, RENDERING_BUTTON];
const RENDERING_DEFAULT = RENDERING_BUTTON;
const DISABLED_DEFAULT = false;
const MOBILEFULLWIDTH_DEFAULT = false;
export default class SfGpsDsAuNswbutton extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    label;
    // @ts-ignore
    @api
    link;
    // @ts-ignore
    @api
    target;
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
    _cstyle = this.defineEnumProperty("cstyle", {
        validValues: CSTYLE_VALUES,
        defaultValue: CSTYLE_DEFAULT
    });
    // @ts-ignore
    @api
    iconStyle;
    _iconStyle = this.defineEnumProperty("iconStyle", {
        validValues: ICONSTYLE_VALUES,
        defaultValue: ICONSTYLE_DEFAULT
    });
    // @ts-ignore
    @api
    rendering;
    _rendering = this.defineEnumProperty("rendering", {
        validValues: RENDERING_VALUES,
        defaultValue: RENDERING_DEFAULT
    });
    // @ts-ignore
    @api
    disabled;
    _disabled = this.defineBooleanProperty("disabled", {
        defaultValue: DISABLED_DEFAULT
    });
    // @ts-ignore
    @api
    mobileFullWidth;
    _mobileFullWidth = this.defineBooleanProperty("mobileFullWidth", {
        defaultValue: MOBILEFULLWIDTH_DEFAULT
    });
    /* deprecated */
    // @ts-ignore
    @api
    block;
    /* computed */
    get computedClassName() {
        const rv = {
            "nsw-button": true,
            [`nsw-button--${this._cstyle.value}`]: this._cstyle.value,
            "nsw-button--full-width": this._mobileFullWidth.value,
            [this.className || ""]: !!this.className
        };
        return rv;
    }
    get computedIsAnchor() {
        return this._rendering.value === RENDERING_A || !!this.link;
    }
    get computedHasIconBefore() {
        return this._iconStyle.value === ICONSTYLE_BEFORE;
    }
    get computedHasIconAfter() {
        return this._iconStyle.value === ICONSTYLE_AFTER;
    }
    /* event management */
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent("click"));
    }
}
