/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const TYPE_VALUES = {
    default: "",
    spaced: "nsw-grid--spaced",
    flushed: "nsw-grid--flushed"
};
const TYPE_DEFAULT = "default";
/**
 * @slot Column-1
 * @slot Column-2
 * @slot Column-3
 * @slot Column-4
 * @slot Column-5
 * @slot Column-6
 * @slot Column-7
 * @slot Column-8
 * @slot Column-9
 * @slot Column-10
 * @slot Column-11
 * @slot Column-12
 */
export default class sfGpsDsAuNswGridLwr extends SfGpsDsElement {
    // @ts-ignore
    @api
    col1ClassName;
    // @ts-ignore
    @api
    col2ClassName;
    // @ts-ignore
    @api
    col3ClassName;
    // @ts-ignore
    @api
    col4ClassName;
    // @ts-ignore
    @api
    col5ClassName;
    // @ts-ignore
    @api
    col6ClassName;
    // @ts-ignore
    @api
    col7ClassName;
    // @ts-ignore
    @api
    col8ClassName;
    // @ts-ignore
    @api
    col9ClassName;
    // @ts-ignore
    @api
    col10ClassName;
    // @ts-ignore
    @api
    col11ClassName;
    // @ts-ignore
    @api
    col12ClassName;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    type;
    _type = this.defineEnumObjectProperty("type", {
        validValues: TYPE_VALUES,
        defaultValue: TYPE_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-grid": true,
            [this._type.value]: this._type.value,
            [this.className || ""]: !!this.className
        };
    }
}
