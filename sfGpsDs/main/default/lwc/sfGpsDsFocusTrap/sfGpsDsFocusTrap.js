/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const DISABLED_DEFAULT = false;
export default class SfGpsDsFocusTrap extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    disabled;
    _disabled = this.defineBooleanProperty("disabled", {
        defaultValue: DISABLED_DEFAULT
    });
    // @ts-ignore
    @api
    options = {};
}
