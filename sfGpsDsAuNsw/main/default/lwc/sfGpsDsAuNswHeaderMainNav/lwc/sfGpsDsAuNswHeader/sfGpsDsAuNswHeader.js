/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { uniqueId } from "c/sfGpsDsHelpers";
import cBasePath from "@salesforce/community/basePath";
const STACKING_HORIZONTAL = "horizontal";
const STACKING_VERTICAL = "vertical";
const STACKING_VALUES = [STACKING_HORIZONTAL, STACKING_VERTICAL];
const STACKING_DEFAULT = STACKING_HORIZONTAL;
const MOBILE_DEFAULT = false;
const SEARCH_DEFAULT = false;
const PROFILE_DEFAULT = false;
export default class SfGpsDsNswHeader extends SfGpsDsElement {
    static renderMode = "light";
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
    headerUrl = "#";
    // @ts-ignore
    @api
    searchAriaLabel = "search";
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    value = "";
    /* hidden when used stand alone */
    // @ts-ignore
    @api
    mainNavId;
    // @ts-ignore
    @api
    mainNavIsOpen = false;
    // @ts-ignore
    @track
    searchIsOpen = false;
    // @ts-ignore
    @api
    mobile;
    _mobile = this.defineBooleanProperty("mobile", {
        defaultValue: MOBILE_DEFAULT
    });
    // @ts-ignore
    @api
    search;
    _search = this.defineBooleanProperty("search", {
        defaultValue: SEARCH_DEFAULT
    });
    // @ts-ignore
    @api
    profile;
    _profile = this.defineBooleanProperty("profile", {
        defaultValue: PROFILE_DEFAULT
    });
    // @ts-ignore
    @api
    mobileLogoStacking;
    _mobileLogoStacking = this.defineEnumProperty("mobileLogoStacking", {
        validValues: STACKING_VALUES,
        defaultValue: STACKING_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-header": true,
            "nsw-header__has-profile": !!this._profile.value,
            [this.className || ""]: !!this.className
        };
    }
    _headerSearchId;
    get computedHeaderSearchId() {
        if (this._headerSearchId == null) {
            this._headerSearchId = uniqueId("sf-gps-ds-au-nsw-header-search");
        }
        return this._headerSearchId;
    }
    _headerInputId;
    get computedHeaderInputId() {
        if (this._headerInputId == null) {
            this._headerInputId = uniqueId("sf-gps-ds-au-nsw-header-search");
        }
        return this._headerInputId;
    }
    get _areLogosHorizontallyStacked() {
        return ((this._mobileLogoStacking.value || STACKING_HORIZONTAL) === STACKING_HORIZONTAL);
    }
    get _areLogosVerticallyStacked() {
        return this._mobileLogoStacking.value === STACKING_VERTICAL;
    }
    get computedHeaderUrl() {
        return this.headerUrl || cBasePath || "/";
    }
    /* helpers */
    setSearchVisible(visible) {
        this.searchIsOpen = visible;
        const element = this.refs.searcharea;
        if (element) {
            element.hidden = !visible;
        }
    }
    /* Event management */
    // eslint-disable-next-line no-unused-vars
    handleCloseSearch(_event) {
        this.setSearchVisible(false);
    }
    // eslint-disable-next-line no-unused-vars
    handleOpenSearch(_event) {
        this.setSearchVisible(true);
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.value = "";
        const element = this.refs.headerinput;
        if (element) {
            element.focus();
        }
    }
    handleChange(event) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.value = event.target.value;
    }
    handleKeyUp(event) {
        event.preventDefault();
        if (event.key === "Enter") {
            this.handleSearch(event);
        }
    }
    handleSearch(event) {
        event.preventDefault();
        this.setSearchVisible(false);
        const searchEvent = new CustomEvent("search");
        this.dispatchEvent(searchEvent);
    }
    handleOpenMenu(_event) {
        const openMenuEvent = new CustomEvent("openmenu");
        this.dispatchEvent(openMenuEvent);
    }
    handleLogoClick(event) {
        if (this.headerUrl) {
            return;
        }
        event.preventDefault();
        const homeEvent = new CustomEvent("home");
        this.dispatchEvent(homeEvent);
    }
}
