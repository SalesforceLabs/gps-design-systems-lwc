/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const BUTTON_ICON = "icon";
const BUTTON_TEXT = "text";
const BUTTON_VALUES = [BUTTON_ICON, BUTTON_TEXT];
const BUTTON_DEFAULT = BUTTON_ICON;
const SHOWLABEL_DEFAULT = false;
export default class SfGpsDsAuNswHeroSearch extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    intro;
    // @ts-ignore
    @api
    links;
    // @ts-ignore
    @api
    value = ""; // ADJUSTED: added value public attribute
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    searchLabel = "Search site for:";
    // @ts-ignore
    @api
    searchButtonLabel = "Search";
    // @ts-ignore
    @api
    button;
    _button = this.defineEnumObjectProperty("button", {
        validValues: BUTTON_VALUES,
        defaultValue: BUTTON_DEFAULT
    });
    /* A slightly confusing of attribute name as we're looking at a yes/no to showing the label, but we stick to the original name */
    // @ts-ignore
    @api
    label;
    _label = this.defineBooleanProperty("label", {
        defaultValue: SHOWLABEL_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "hero-search": true,
            [this.className || ""]: !!this.className
        };
    }
    get computedLabelClassName() {
        return {
            "nsw-form__label": true,
            "sr-only": !this.label
        };
    }
    get computedInputGroupClassName() {
        return {
            "nsw-form__input-group": true,
            "nsw-form__input-group--icon": this.computedHasIconButton
        };
    }
    get computedHasTextButton() {
        return this._button.value === BUTTON_TEXT;
    }
    get computedHasIconButton() {
        return this._button.value === BUTTON_ICON;
    }
    /* event management */
    handleChange(event) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.value = event.target.value;
    }
    handleKeyUp(event) {
        event.preventDefault(); // avoid submitting
        if (event.key === "enter") {
            this.dispatchEvent(new CustomEvent("search"));
        }
    }
    // eslint-disable-next-line no-unused-vars
    handleClick(_event) {
        this.dispatchEvent(new CustomEvent("search"));
    }
}
