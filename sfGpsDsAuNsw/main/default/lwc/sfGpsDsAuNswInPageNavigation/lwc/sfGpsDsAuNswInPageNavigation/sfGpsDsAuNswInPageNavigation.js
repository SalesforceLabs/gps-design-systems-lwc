/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { uniqueId } from "c/sfGpsDsHelpers";
const FIRSTCHILD_DEFAULT = false;
const ID_BASE = "sf-gps-ds-au-nsw-in-page-nav-label";
export default class SfGpsDsAuNswInPageNavigation extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    items = [];
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
    /* computed */
    get computedClassName() {
        return {
            "nsw-in-page-nav": true,
            [this.className || ""]: this.className
        };
    }
    _labelledById;
    get computedAriaLabelledById() {
        if (this._labelledById === undefined) {
            this._labelledById = uniqueId(ID_BASE);
        }
        return this._labelledById;
    }
}
