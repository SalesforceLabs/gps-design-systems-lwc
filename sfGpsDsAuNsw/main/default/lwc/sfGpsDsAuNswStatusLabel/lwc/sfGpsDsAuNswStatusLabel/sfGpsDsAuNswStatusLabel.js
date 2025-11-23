/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const STATUS_DEFAULT = "info";
const STATUS_VALUES = {
    info: "nsw-status-label--info",
    success: "nsw-status-label--success",
    warning: "nsw-status-label--warning",
    error: "nsw-status-label--error"
};
export default class SfGpsDsAuNswStatusLabel extends SfGpsDsElement {
    // @ts-ignore
    @api
    label;
    // @ts-ignore
    @api
    status;
    _status = this.defineEnumObjectProperty("status", {
        validValues: STATUS_VALUES,
        defaultValue: STATUS_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-status-label": true,
            [this._status.value]: !!this._status.value
        };
    }
}
