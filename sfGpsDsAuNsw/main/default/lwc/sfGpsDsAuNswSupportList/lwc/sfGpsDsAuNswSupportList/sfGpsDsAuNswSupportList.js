/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const I18N = {
    waratahLogoTitle: "NSW Government waratah logo"
};
const LOGO_POSITION_NONE = "none";
const LOGO_POSITION_LABELS = "labels";
const LOGO_POSITION_LOGOS = "logos";
const LOGO_POSITION_VALUES = [
    LOGO_POSITION_NONE,
    LOGO_POSITION_LABELS,
    LOGO_POSITION_LOGOS
];
const LOGO_POSITION_DEFAULT = LOGO_POSITION_LABELS;
/**
 * @slot SupportLogo1
 * @slot SupportLogo2
 * @slot SupportLogo3
 * @slot SupportLogo4
 */
export default class SfGpsDsAuNswSupportList extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    header = "Supported by";
    // @ts-ignore
    @api
    departments;
    // @ts-ignore
    @api
    supportLogos;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    logoPosition;
    _logoPosition = this.defineEnumProperty("logoPosition", {
        validValues: LOGO_POSITION_VALUES,
        defaultValue: LOGO_POSITION_DEFAULT
    });
    /* computed */
    get i18n() {
        return I18N;
    }
    get computedClassName() {
        return {
            "nsw-support-list": true,
            [this.className || ""]: !!this.className
        };
    }
    get computedContainerClassName() {
        return {
            "nsw-support-list__container": true,
            "nsw-support-list__container-no-text": !this.computedHasDepartments
        };
    }
    get computedShowLogoTop() {
        return this._logoPosition.value === LOGO_POSITION_LABELS;
    }
    get computedShowLogoBottom() {
        return this._logoPosition.value === LOGO_POSITION_LOGOS;
    }
    get computedHasDepartments() {
        return !!this.departments &&
            this.departments?.length > 0;
    }
    get computedHasSupportLogos() {
        return !!this.supportLogos &&
            this.supportLogos.length > 0;
    }
}
