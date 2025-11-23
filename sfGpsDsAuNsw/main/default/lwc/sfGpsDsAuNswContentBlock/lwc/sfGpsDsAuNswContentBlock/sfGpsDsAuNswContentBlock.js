/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
export default class SfGpsDsAuNswContentBlock extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    image;
    // @ts-ignore
    @api
    imageAlt;
    // @ts-ignore
    @api
    icon;
    // @ts-ignore
    @api
    mainLink;
    // @ts-ignore
    @api
    links = [];
    // @ts-ignore
    @api
    className;
    /* api: headline - deprecated, use title instead */
    // @ts-ignore
    @api
    get headline() {
        return this.title;
    }
    set headline(value) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.title = value;
    }
    /* computed */
    get computedClassName() {
        return {
            "nsw-content-block": true,
            [this.className || ""]: !!this.className
        };
    }
}
