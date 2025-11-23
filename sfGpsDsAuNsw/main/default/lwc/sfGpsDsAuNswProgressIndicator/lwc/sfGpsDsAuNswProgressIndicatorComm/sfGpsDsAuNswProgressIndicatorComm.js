/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
export default class SfGpsDsAuNswProgressIndicatorComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    step = 1;
    // @ts-ignore
    @api
    of = 1;
    // @ts-ignore
    @api
    mode;
    // @ts-ignore
    @api
    className;
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
