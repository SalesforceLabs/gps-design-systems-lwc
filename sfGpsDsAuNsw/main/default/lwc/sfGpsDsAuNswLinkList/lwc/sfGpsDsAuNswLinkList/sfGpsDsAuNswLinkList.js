/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const FIRSTCHILD_DEFAULT = false;
export default class SfGpsDsAuNswLinkList extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    links;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    // @ts-ignore
    firstChild;
    _firstChild = this.defineBooleanProperty("firstChild", {
        defaultValue: FIRSTCHILD_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-link-list": true,
            [this.className || ""]: !!this.className
        };
    }
}
