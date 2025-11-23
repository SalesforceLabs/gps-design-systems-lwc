/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { htmlDecode, isArray } from "c/sfGpsDsHelpers";
const I18N = {
    emptyTitle: "No matching content"
};
export default class SfGpsDsAuNswCardCollectionComm extends SfGpsDsIpLwc {
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
    xsWidth = "12";
    // @ts-ignore
    @api
    smWidth = "12";
    // @ts-ignore
    @api
    mdWidth = "6";
    // @ts-ignore
    @api
    lgWidth = "6";
    // @ts-ignore
    @api
    xlWidth = "4";
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
    /* api: inputJSON, String */
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
    get computedClassName() {
        return {
            "nsw-grid": true,
            [this.className || ""]: !!this.className
        };
    }
    get computedColClassName() {
        return {
            "nsw-col": true,
            ["nsw-col-xs-" + this.xsWidth]: !!this.xsWidth,
            ["nsw-col-sm-" + this.smWidth]: !!this.smWidth,
            ["nsw-col-md-" + this.mdWidth]: !!this.mdWidth,
            ["nsw-col-lg-" + this.lgWidth]: !!this.lgWidth,
            ["nsw-col-xl-" + this.xlWidth]: !!this.xlWidth
        };
    }
    get isEmpty() {
        return (this._didLoadOnce && (this._items == null || this._items.length === 0));
    }
    get i18n() {
        return I18N;
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
            title: card.title || card.headline, // it used to be called headline in v1
            copy: card.copy ? htmlDecode(card.copy) : null,
            footer: card.footer ? htmlDecode(card.footer) : null,
            index: card.index || `card-${index + 1}`
        }));
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
