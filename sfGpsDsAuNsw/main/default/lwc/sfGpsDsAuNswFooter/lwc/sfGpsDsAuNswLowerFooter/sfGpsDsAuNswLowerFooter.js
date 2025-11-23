/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
export default class SfGpsDsAuNswLowerFooter extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    items;
    // @ts-ignore
    @api
    statement;
    // @ts-ignore
    @api
    className;
    /* computed */
    get computedClassName() {
        return {
            "nsw-footer__lower": true,
            [this.className || ""]: !!this.className
        };
    }
    /* event management */
    handleClick(event) {
        const target = event.currentTarget;
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("navclick", {
            detail: target.dataset.ndx
        }));
    }
}
