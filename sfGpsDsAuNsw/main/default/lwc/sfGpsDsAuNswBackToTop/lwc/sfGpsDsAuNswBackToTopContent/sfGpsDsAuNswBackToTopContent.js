/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const ISACTIVE_DEFAULT = false;
const ISMOBILE_DEFAULT = false;
export default class SfGpsDsAuNswBackToTopContent extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    isActive;
    _isActive = this.defineBooleanProperty("isActive", {
        defaultValue: ISACTIVE_DEFAULT
    });
    // @ts-ignore
    @api
    isMobile;
    _isMobile = this.defineBooleanProperty("isMobile", {
        defaultValue: ISMOBILE_DEFAULT
    });
    // @ts-ignore
    @api
    className;
    /* computed */
    get computedClassName() {
        return {
            "nsw-button": true,
            "nsw-button--dark": true,
            "nsw-button--flex": true,
            "nsw-back-to-top": true,
            active: this._isActive.value,
            [this.className || ""]: !!this.className
        };
    }
    /* event management */
    // eslint-disable-next-line no-unused-vars
    handleClick(_event) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}
