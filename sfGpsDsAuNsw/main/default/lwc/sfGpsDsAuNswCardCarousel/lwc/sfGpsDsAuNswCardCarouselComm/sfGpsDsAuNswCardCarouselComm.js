/*
 * Copyright (c) 2024-20245, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { htmlDecode, isArray } from "c/sfGpsDsHelpers";
export default class SfGpsDsAuNswCardCarouselComm extends SfGpsDsIpLwc {
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    accessibilityLabel;
    // @ts-ignore
    @api
    drag;
    // @ts-ignore
    @api
    justifyContent;
    // @ts-ignore
    @api
    navigation;
    // @ts-ignore
    @api
    navigationItemClassName;
    // @ts-ignore
    @api
    navigationClassName;
    // @ts-ignore
    @api
    paginationClassName;
    // @ts-ignore
    @api
    cstyle = "white";
    // @ts-ignore
    @api
    headline = false;
    // @ts-ignore
    @api
    orientation = "vertical";
    // @ts-ignore
    @api
    displayDate = false;
    // @ts-ignore
    @api
    dateStyle = "medium";
    // @ts-ignore
    @api
    className;
    /* api: ipName, String */
    // @ts-ignore
    @api
    // @ts-ignore
    get ipName() {
        // @ts-ignore
        return super.ipName;
    }
    set ipName(value) {
        // @ts-ignore
        super.ipName = value;
    }
    /* api: inputJSON */
    // @ts-ignore
    @api
    // @ts-ignore
    get inputJSON() {
        // @ts-ignore
        return super.inputJSON;
    }
    set inputJSON(value) {
        // @ts-ignore
        super.inputJSON = value;
    }
    /* api: optionsJSON, String */
    // @ts-ignore
    @api
    // @ts-ignore
    get optionsJSON() {
        // @ts-ignore
        return super.optionsJSON;
    }
    set optionsJSON(value) {
        // @ts-ignore
        super.optionsJSON = value;
    }
    /* computed */
    get _isEmpty() {
        return (this._didLoadOnce && (this._items == null || this._items.length === 0));
    }
    get navigationNavigation() {
        return this.navigation === "navigation" || this.navigation === "pagination";
    }
    get navigationPagination() {
        return this.navigation === "pagination";
    }
    get loop() {
        return this.navigation === "loop";
    }
    /* methods */
    mapIpData(data) {
        if (!data) {
            return [];
        }
        if (!isArray(data)) {
            data = [data];
        }
        return data.map((card, index) => ({
            ...card,
            title: card.title || card.headline, // it used to be called headline in v1 and it's not in the payload in v2
            copy: card.copy ? htmlDecode(card.copy) : null,
            footer: card.footer ? htmlDecode(card.footer) : null,
            index: card.index || `card-${index + 1}`,
            cstyle: this.cstyle,
            headline: this.headline,
            orientation: this.orientation,
            dateStyle: this.dateStyle,
            date: this.displayDate ? card.date : null
        }));
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
