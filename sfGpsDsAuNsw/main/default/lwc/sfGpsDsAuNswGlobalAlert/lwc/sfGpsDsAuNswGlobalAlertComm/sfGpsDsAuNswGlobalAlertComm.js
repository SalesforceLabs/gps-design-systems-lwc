/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const CTA_DEFAULT = {};
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswGlobalAlertComm";
export default class SfGpsDsAuNswGlobalAlertComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    copy;
    // @ts-ignore
    @api
    as = "default";
    // @ts-ignore
    @api
    ctaStyle = "link";
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    cta;
    _cta = this.defineMarkdownFirstLinkProperty("cta", {
        errorCode: "CT-MD",
        errorText: "Error while parsin Call to action markdown."
    });
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
