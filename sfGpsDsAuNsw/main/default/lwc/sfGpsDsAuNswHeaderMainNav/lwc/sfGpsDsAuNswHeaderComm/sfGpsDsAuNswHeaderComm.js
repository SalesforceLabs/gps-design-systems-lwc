/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";
import userId from "@salesforce/user/Id";
import isGuest from "@salesforce/user/isGuest";
import userAliasField from "@salesforce/schema/User.Alias";
import { getRecord } from "lightning/uiRecordApi";
export default class SfGpsDsAuNswHeaderComm extends NavigationMixin(SfGpsDsLwc) {
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
    profile = false;
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
    className;
    // @ts-ignore
    @api
    mainNavId;
    // @ts-ignore
    @api
    mainNavIsOpen = false;
    userAlias;
    // @ts-ignore
    @wire(getRecord, { recordId: userId, fields: [userAliasField] })
    getUserDetails({ error, data }) {
        if (data) {
            this.userAlias = data.fields.Alias.value;
        }
        else if (error) {
            console.debug(error);
        }
    }
    /* computed */
    get _isGuest() {
        return isGuest;
    }
    /* event management */
    handleSearch(event) {
        const queryTerm = event.target.value;
        // Navigate to search page using lightning/navigation API:
        // https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation
        // @ts-ignore
        this[NavigationMixin.Navigate]({
            type: "standard__search",
            state: {
                term: queryTerm
            }
        });
    }
    // eslint-disable-next-line no-unused-vars
    handleOpenMenu(_event) {
        const openMenuEvent = new CustomEvent("openmenu");
        this.dispatchEvent(openMenuEvent);
    }
    // eslint-disable-next-line no-unused-vars
    handleHome(_event) {
        // @ts-ignore
        this[NavigationMixin.GenerateUrl]({
            // Pass in pageReference
            type: "standard__namedPage",
            attributes: {
                pageName: "home"
            }
        }).then((url) => {
            window.open(url, "_self");
        });
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
