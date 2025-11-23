/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { isArray, isObject } from "c/sfGpsDsHelpers";
const CAPTIONLOCATION_TOP = "top";
const CAPTIONLOCATION_BOTTOM = "bottom";
const CAPTIONLOCATION_NONE = "none";
const CAPTIONLOCATION_VALUES = [
    CAPTIONLOCATION_BOTTOM,
    CAPTIONLOCATION_NONE,
    CAPTIONLOCATION_TOP
];
const CAPTIONLOCATION_DEFAULT = CAPTIONLOCATION_BOTTOM;
const ISSTRIPED_DEFAULT = false;
const ISBORDERED_DEFAULT = false;
export default class SfGpsDsAuNswTable extends SfGpsDsElement {
    // @ts-ignore
    @api
    caption;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    offset;
    _offset = this.defineIntegerProperty("offset", {
        minValue: 0,
        defaultValue: 0
    });
    // @ts-ignore
    @api
    limit;
    _limit = this.defineIntegerProperty("limit", {
        minValue: 1,
        defaultValue: null
    });
    // @ts-ignore
    @api
    captionLocation;
    _captionLocation = this.defineEnumProperty("captionLocation", {
        validValues: CAPTIONLOCATION_VALUES,
        defaultValue: CAPTIONLOCATION_DEFAULT
    });
    // @ts-ignore
    @api
    isStriped;
    _isStriped = this.defineBooleanProperty("isStriped", {
        defaultValue: ISSTRIPED_DEFAULT
    });
    // @ts-ignore
    @api
    isBordered;
    _isBordered = this.defineBooleanProperty("isBordered", {
        defaultValue: ISBORDERED_DEFAULT
    });
    /* api: content, Array of Objects */
    _content;
    _contentOriginal;
    _attributes = new Set();
    // @ts-ignore
    @api
    get content() {
        return this._contentOriginal;
    }
    set content(value) {
        this._contentOriginal = value;
        this._attributes = new Set();
        if (value == null) {
            value = [];
        }
        else if (!isArray(value)) {
            value = [value];
        }
        this._content =
            value
                .map((row, rowIndex) => {
                let nRow = {
                    _key: `row-${rowIndex + 1}`,
                    _items: {}
                };
                for (let colName in row) {
                    if (Object.hasOwn(row, colName)) {
                        if (!colName.startsWith("_")) {
                            let col = row[colName];
                            this._attributes.add(colName);
                            if (col !== null && isObject(col)) {
                                const cio = col;
                                const cioType = cio.type;
                                nRow._items[colName] = {
                                    ...cio,
                                    _key: colName,
                                    _isMarkdown: cioType === "markdown",
                                    _isString: cioType === "string",
                                    _isNumber: cioType === "number",
                                    _isBoolean: cioType === "boolean",
                                    _isReference: cioType === "reference"
                                };
                            }
                            else if ([
                                "string",
                                "number",
                                "boolean"
                            ].includes(typeof col)) {
                                const type = col != null
                                    ? typeof col
                                    : "string";
                                nRow._items[colName] = {
                                    value: col,
                                    type: type,
                                    _key: colName,
                                    _isMarkdown: false,
                                    _isString: type === "string",
                                    _isNumber: type === "number",
                                    _isBoolean: type === "boolean",
                                    _isReference: false
                                };
                            }
                        }
                    }
                }
                return nRow;
            });
    }
    /* api: headers, Array of Objects */
    _headers;
    _headersOriginal;
    // @ts-ignore
    @api
    get headers() {
        return this._headersOriginal;
    }
    set headers(value) {
        this._headersOriginal = value;
        if (!isArray(value)) {
            value = [value];
        }
        this._headers = value;
    }
    /* computed */
    get _tableHeaders() {
        return (this._headers ||
            Array.from(this._attributes.keys()).map((attr) => ({
                name: attr,
                label: attr
            })));
    }
    get _tableRows() {
        if (this._content == null) {
            return undefined;
        }
        const headers = this._tableHeaders;
        const offset = this._offset.value || 0;
        const limit = this._limit.value || this._content.length || 0;
        const content = this._content.slice(offset, offset + limit);
        return content.map((row, index) => ({
            _key: `row-${index + 1}`,
            _cols: headers.map((header) => row._items[header.name] || {
                _key: `col-empty-${index + 1}-${header.name}`
            })
        }));
    }
    get computedClassName() {
        return {
            "nsw-table": true,
            "nsw-table--striped": this._isStriped.value,
            "nsw-table--bordered": this._isBordered.value,
            "nsw-table--caption-top": this._captionLocation.value === CAPTIONLOCATION_TOP,
            [this.className || ""]: !!this.className
        };
    }
    get computedShowCaption() {
        return this._captionLocation.value !== CAPTIONLOCATION_NONE;
    }
}
