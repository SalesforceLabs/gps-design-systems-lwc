/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
export default class SfGpsDsAuNswUpperFooter extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    className;
    /* api: items */
    _items;
    _itemsOriginal;
    // @ts-ignore
    @api
    get items() {
        return this._itemsOriginal;
    }
    set items(items) {
        this._itemsOriginal = items;
        this.itemsMapping();
    }
    /* computed */
    get computedClassName() {
        return {
            "nsw-footer__upper": true,
            [this.className || ""]: !!this.className
        };
    }
    get computedHasItems() {
        return !!this._items?.length;
    }
    /* methods */
    _mapItems;
    itemsMapping() {
        let map = {};
        this._items = this._itemsOriginal
            ? this.mapItems("item", 0, map, this._itemsOriginal)
            : undefined;
        this._mapItems = map;
    }
    mapItems(parentIndex, parentLevel, map, items) {
        let index = 0;
        return items.map((item) => {
            let result = {
                ...item,
                index: item.index || `${parentIndex}-${index++}`,
                //level: parentLevel + 1,
                subNav: []
            };
            if (item.subNav) {
                result.subNav = this.mapItems(result.index, parentLevel + 1, map, item.subNav);
            }
            map[result.index] = result;
            return result;
        });
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
