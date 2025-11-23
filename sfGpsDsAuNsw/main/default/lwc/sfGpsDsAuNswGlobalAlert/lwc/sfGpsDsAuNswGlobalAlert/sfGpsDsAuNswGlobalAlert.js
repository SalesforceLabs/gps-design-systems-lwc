/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const AS_VALUES = {
    default: {
        main: "",
        button: "nsw-button--white"
    },
    light: {
        main: "nsw-global-alert--light",
        button: "nsw-button--dark"
    },
    critical: {
        main: "nsw-global-alert--critical",
        button: "nsw-button--white"
    }
};
const AS_DEFAULT = "default";
const CTASTYLE_LINK = "link";
const CTASTYLE_BUTTON = "button";
const CTASTYLE_VALUES = [CTASTYLE_BUTTON, CTASTYLE_LINK];
const CTASTYLE_DEFAULT = CTASTYLE_LINK;
const CTAPREVENTDEFAULT_DEFAULT = false;
export default class SfGpsDsAuNswGlobalAlert extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    copy;
    // @ts-ignore
    @api
    ctaText;
    // @ts-ignore
    @api
    ctaHref;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @track
    _isClosed;
    // @ts-ignore
    @api
    as;
    _as = this.defineEnumObjectProperty("as", {
        validValues: AS_VALUES,
        defaultValue: AS_DEFAULT
    });
    // @ts-ignore
    @api
    ctaStyle;
    _ctaStyle = this.defineEnumProperty("ctaStyle", {
        validValues: CTASTYLE_VALUES,
        defaultValue: CTASTYLE_DEFAULT
    });
    // @ts-ignore
    @api
    ctaPreventDefault;
    _ctaPreventDefault = this.defineBooleanProperty("ctaPreventDefault", {
        defaultValue: CTAPREVENTDEFAULT_DEFAULT
    });
    /* computed */
    get space() {
        return " ";
    }
    get computedClassName() {
        return {
            "nsw-global-alert": true,
            [this._as.value.main]: this._as.value,
            [this.className || ""]: !!this.className
        };
    }
    get computedButtonClassName() {
        return {
            "nsw-button": true,
            [this._as.value.button]: this._as.value.button
        };
    }
    get _isCtaLinkStyle() {
        return this._ctaStyle.value === CTASTYLE_LINK;
    }
    get _isCtaButtonStyle() {
        return this._ctaStyle.value === CTASTYLE_BUTTON;
    }
    /* event management */
    handleCtaClick(event) {
        if (this._ctaPreventDefault.value) {
            event.preventDefault();
        }
        this.dispatchEvent(new CustomEvent("ctaclick"));
    }
    // eslint-disable-next-line no-unused-vars
    handleCloseClick(_event) {
        this._isClosed = true;
        this.dispatchEvent(new CustomEvent("close"));
    }
}
