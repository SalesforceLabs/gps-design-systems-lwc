/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import getRecordSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getRecordSummary";
import getObjectSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getObjectSummary";
export default class sfGpsDsAuNswBreadcrumbsRecordComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    label = "Breadcrumb";
    // @ts-ignore
    @api
    linkComponent = "a";
    // @ts-ignore
    @api
    className = "";
    /* api: homeLabel */
    _homeLabel;
    // @ts-ignore
    @api
    get homeLabel() {
        return this._homeLabel || "Home";
    }
    set homeLabel(value) {
        this._homeLabel = value;
    }
    // @ts-ignore
    @api
    recordId;
    _recordId = this.defineStringProperty("recordId", {
        watcher: () => this.updateBreadcrumbs()
    });
    // @ts-ignore
    @api
    objectApiName;
    _objectApiName = this.defineStringProperty("objectApiName", {
        watcher: () => this.updateBreadcrumbs()
    });
    /* methods */
    _items = [];
    updateBreadcrumbs() {
        if (this._recordId.value) {
            getRecordSummary({ recordId: this._recordId.value })
                .then((data) => {
                this._items = [
                    { index: 0, text: this.homeLabel, url: "../" },
                    {
                        index: 1,
                        text: data[0] || "Object",
                        url: `../recordlist/${data[1] || "object"}/Default`
                    },
                    { index: 2, text: data[2] || "This record", url: "" }
                ];
            })
                .catch((error) => {
                console.log(error);
                this.addError("FR-RS", "Cannot fetch record summary");
            });
        }
        else if (this._objectApiName.value) {
            getObjectSummary({ objectApiName: this._objectApiName.value })
                .then((data) => {
                this._items = [
                    { index: 0, text: this.homeLabel, url: "./" },
                    { index: 1, text: data || "Object", url: "" }
                ];
            })
                .catch((error) => {
                console.log(error);
                this.addError("FR-OS", "Cannot fetch object summary");
            });
        }
        else {
            this._items = [
                { index: 0, text: this.homeLabel, url: "./" },
                { index: 1, text: "This page", url: "" }
            ];
        }
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
