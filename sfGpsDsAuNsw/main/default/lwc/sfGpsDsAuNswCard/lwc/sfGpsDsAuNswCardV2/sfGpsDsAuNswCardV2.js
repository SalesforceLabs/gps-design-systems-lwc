/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { parseIso8601, getUserLocale, formatDate } from "c/sfGpsDsHelpers";
const DATE_STYLE_SHORT = "short";
const DATE_STYLE_MEDIUM = "medium";
const DATE_STYLE_LONG = "long";
const DATE_STYLE_FULL = "full";
const DATE_STYLE_VALUES = [
    DATE_STYLE_FULL,
    DATE_STYLE_LONG,
    DATE_STYLE_MEDIUM,
    DATE_STYLE_SHORT
];
const DATE_STYLE_DEFAULT = DATE_STYLE_MEDIUM;
const ORIENTATION_VALUES = {
    vertical: "",
    horizontal: "nsw-card--horizontal"
};
const ORIENTATION_DEFAULT = "vertical";
const CSTYLE_VALUES = {
    white: "nsw-card--white",
    dark: "nsw-card--dark",
    light: "nsw-card--light"
};
const CSTYLE_DEFAULT = "white";
const HIGHLIGHT_DEFAULT = false;
const HEADLINE_DEFAULT = false;
const BORDER_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;
export default class sfGpsDsAuNswCardV2 extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    link;
    // @ts-ignore
    @api
    tag;
    // @ts-ignore
    @api
    image;
    // @ts-ignore
    @api
    imageAlt;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    preventDefault;
    _preventDefault = this.defineBooleanProperty("preventDefault", {
        defaultValue: PREVENTDEFAULT_DEFAULT
    });
    // @ts-ignore
    @api
    headline;
    _headline = this.defineBooleanProperty("headline", {
        defaultValue: HEADLINE_DEFAULT
    });
    // @ts-ignore
    @api
    border;
    _border = this.defineBooleanProperty("border", {
        defaultValue: BORDER_DEFAULT
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
    orientation;
    _orientation = this.defineEnumObjectProperty("orientation", {
        validValues: ORIENTATION_VALUES,
        defaultValue: ORIENTATION_DEFAULT
    });
    // @ts-ignore
    @api
    highlight;
    _highlight = this.defineBooleanProperty("highlight", {
        defaultValue: HIGHLIGHT_DEFAULT
    });
    // @ts-ignore
    @api
    dateStyle;
    _dateStyle = this.defineEnumProperty("dateStyle", {
        validValues: DATE_STYLE_VALUES,
        defaultValue: DATE_STYLE_DEFAULT
    });
    /* api: date */
    _date;
    _dateOriginal;
    // @ts-ignore
    @api
    get date() {
        return this._dateOriginal;
    }
    set date(value) {
        this._dateOriginal = value;
        if (value instanceof Date) {
            this._date = value;
        }
        else {
            this._date = value
                ? parseIso8601(value.toString())
                : undefined;
        }
    }
    get _dateISOString() {
        return this._date
            ? this._date.toISOString()
            : undefined;
    }
    get _dateLocaleString() {
        return this._date
            ? formatDate(this._date, this._dateStyle.value || DATE_STYLE_DEFAULT, this._userLocale)
            : undefined;
    }
    /* computed */
    get computedClassName() {
        return {
            "nsw-card": true,
            "nsw-card--headline": this._headline.value,
            "nsw-card--highlight": this._highlight.value,
            "nsw-card--border": this._border.value,
            [this._cstyle.value]: !!this._cstyle.value,
            [this._orientation.value]: !!this._orientation.value,
            [this.className || ""]: !!this.className
        };
    }
    /* methods */
    // @ts-ignore
    @api
    click() {
        const ref = this.refs.link;
        if (ref) {
            ref.click();
        }
    }
    /* event management */
    handleClick(event) {
        if (this._preventDefault.value) {
            event.preventDefault();
        }
        this.dispatchEvent(new CustomEvent("navigate", {
            detail: this.link
        }));
    }
    /* lifecycle */
    _userLocale;
    connectedCallback() {
        super.connectedCallback?.();
        this._userLocale = getUserLocale();
    }
}
