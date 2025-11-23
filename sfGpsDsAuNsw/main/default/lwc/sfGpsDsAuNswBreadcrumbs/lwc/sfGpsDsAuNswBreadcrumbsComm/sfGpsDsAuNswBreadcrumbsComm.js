/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const ITEMS_DEFAULT = [];
// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswBreadcrumbsComm";
export default class sfGpsDsAuNswBreadcrumbsComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    label = "Breadcrumb";
    // @ts-ignore
    @api
    linkComponent = "a";
    // @ts-ignore
    @api
    className = "";
    // @ts-ignore
    @api
    items;
    _items = this.defineMarkdownLinksProperty("items", {
        errorCode: "IT-MD",
        errorText: "Issue when parsing Items markdown",
        defaultValue: ITEMS_DEFAULT
    });
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
