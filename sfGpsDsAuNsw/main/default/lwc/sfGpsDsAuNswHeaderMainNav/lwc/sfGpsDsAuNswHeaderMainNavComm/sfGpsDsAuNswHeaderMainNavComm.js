/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
export default class SfGpsDsAuNswHeaderMainNavComm extends SfGpsDsIpLwc {
    // @ts-ignore
    @api
    mode = "Integration Procedure";
    // @ts-ignore
    @api
    navigationDevName;
    // @ts-ignore
    @api
    get ipName() {
        return super.ipName;
    }
    set ipName(value) {
        super.ipName = value;
    }
    // @ts-ignore
    @api
    get inputJSON() {
        return super.inputJSON;
    }
    set inputJSON(value) {
        super.inputJSON = value;
    }
    // @ts-ignore
    @api
    get optionsJSON() {
        return super.optionsJSON;
    }
    set optionsJSON(value) {
        super.optionsJSON = value;
    }
    // Header
    // @ts-ignore
    @api
    masterbrand;
    // @ts-ignore
    @api
    masterbrandAlt;
    // @ts-ignore
    @api
    srMasterbrandLabel = "NSW Government";
    // @ts-ignore
    @api
    logo;
    // @ts-ignore
    @api
    logoAlt;
    // @ts-ignore
    @api
    menuLabel = "menu";
    // @ts-ignore
    @api
    searchLabel = "Search site for:";
    // @ts-ignore
    @api
    siteTitle;
    // @ts-ignore
    @api
    siteDescriptor;
    // @ts-ignore
    @api
    headerUrl;
    // @ts-ignore
    @api
    mobile = false;
    // @ts-ignore
    @api
    mobileLogoStacking = "horizontal";
    // @ts-ignore
    @api
    search = false;
    // @ts-ignore
    @api
    profileIpName;
    // @ts-ignore
    @api
    profileInputJSON;
    // @ts-ignore
    @api
    profileOptionsJSON;
    // @ts-ignore
    @api
    headerClassName;
    // MainNav
    // @ts-ignore
    @api
    megaMenu = false;
    // @ts-ignore
    @api
    mainNavClassName;
    // @ts-ignore
    @api
    mainNavId = "nav";
    /* event management */
    _isActive = false;
    // eslint-disable-next-line no-unused-vars
    handleOpenMenu(_event) {
        this._isActive = true;
    }
    // eslint-disable-next-line no-unused-vars
    handleCloseMenu(_event) {
        this._isActive = false;
    }
}
