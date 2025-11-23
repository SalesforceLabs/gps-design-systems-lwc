/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { isArray } from "c/sfGpsDsHelpers";
export default class sfGpsDsAuNswBreadcrumbs extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    label = "breadcrumbs";
    // @ts-ignore
    @api
    items = [];
    // @ts-ignore
    @api
    containerClassName = "nsw-p-bottom-xs nsw-m-bottom-sm";
    // @ts-ignore
    @api
    className = "";
    // @ts-ignore
    @track
    _showMore = false;
    _moreToggleKey = "more-toggle";
    /* computed */
    get computedClassName() {
        return {
            "nsw-breadcrumbs": true,
            [this.className]: this.className
        };
    }
    get computedOlClassName() {
        return {
            "nsw-breadcrumbs__show-all": this._showMore
        };
    }
    get decoratedItems() {
        if (!isArray(this.items)) {
            return [];
        }
        const length = this.items.length;
        return this.items.map((item, index) => ({
            ...item,
            _isSecond: index === 1 && length > 3
        }));
    }
    /* event management */
    // eslint-disable-next-line no-unused-vars
    handleMoreToggle(_event) {
        this._showMore = true;
    }
}
