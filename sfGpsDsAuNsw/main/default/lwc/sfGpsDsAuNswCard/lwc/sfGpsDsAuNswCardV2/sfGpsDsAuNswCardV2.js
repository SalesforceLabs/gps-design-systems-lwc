/*
 * Copyright (c) 2023-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import {
  parseIso8601,
  getUserLocale,
  formatDate,
  normaliseBoolean,
  normaliseString
} from "c/sfGpsDsHelpers";

const DATE_STYLE_SHORT = "short";
const DATE_STYLE_MEDIUM = "medium";
const DATE_STYLE_LONG = "long";
const DATE_STYLE_FULL = "full";
const DATE_STYLE_VALUES = [
  DATE_STYLE_FULL,
  DATE_STYLE_LONG,
  DATE_STYLE_MEDIUM,
  DATE_STYLE_SHORT
];
const DATE_STYLE_DEFAULT = DATE_STYLE_MEDIUM;

const ORIENTATION_VALUES = {
  vertical: "",
  horizontal: "nsw-card--horizontal"
};
const ORIENTATION_DEFAULT = "vertical";

const CSTYLE_VALUES = {
  white: "nsw-card--white",
  dark: "nsw-card--dark",
  light: "nsw-card--light"
};
const CSTYLE_DEFAULT = "white";

const HIGHLIGHT_DEFAULT = false;
const HEADLINE_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api link;
  @api tag;
  @api image;
  @api imageAlt;
  @api preventDefault = false;
  @api className;

  /* api: headline */

  _headline = HEADLINE_DEFAULT;
  _headlineOriginal = HEADLINE_DEFAULT;

  @api
  get headline() {
    return this._headlineOriginal;
  }

  set headline(value) {
    this._headlineOriginal = value;
    this._headline = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HEADLINE_DEFAULT
    });
  }

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: orientation */

  _orientation = ORIENTATION_VALUES[ORIENTATION_DEFAULT];
  _orientationOriginal = ORIENTATION_DEFAULT;

  @api
  get orientation() {
    return this._orientationOriginal;
  }

  set orientation(value) {
    this._orientationOriginal = value;
    this._orientation = normaliseString(value, {
      validValues: ORIENTATION_VALUES,
      fallbackValue: ORIENTATION_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: highlight */

  _highlight = HIGHLIGHT_DEFAULT;
  _highlightOriginal = HIGHLIGHT_DEFAULT;

  @api
  get highlight() {
    return this._highlightOriginal;
  }

  set highlight(value) {
    this._highlightOriginal = value;
    this._highlight = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HIGHLIGHT_DEFAULT
    });
  }

  /* api: dateStyle */

  _dateStyle = DATE_STYLE_DEFAULT;
  _dateStyleOriginal = DATE_STYLE_DEFAULT;

  @api
  get dateStyle() {
    return this._dateStyleOriginal;
  }

  set dateStyle(value) {
    this._dateStyleOriginal = value;
    this._dateStyle = normaliseString(value, {
      validValues: DATE_STYLE_VALUES,
      fallbackValue: DATE_STYLE_DEFAULT
    });
  }

  /* api: date */

  _date;
  _dateOriginal;

  @api
  get date() {
    return this._dateOriginal;
  }

  set date(value) {
    this._dateOriginal = value;

    if (value instanceof Date) {
      this._date = value;
    } else {
      this._date = value ? parseIso8601(value.toString()) : null;
    }
  }

  get _dateISOString() {
    return this._date ? this._date.toISOString() : null;
  }

  get _dateLocaleString() {
    return this._date
      ? formatDate(
          this._date,
          this._dateStyle || DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : null;
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-card": true,
      "nsw-card--headline": this._headline,
      "nsw-card--highlight": this._highlight,
      [this._cstyle]: this._cstyle,
      [this._orientation]: this._orientation,
      [this.className]: this.className
    };
  }

  /* methods */

  @api
  click() {
    const ref = this.refs.link;

    if (ref) {
      ref.click();
    }
  }

  /* event management */

  handleClick(event) {
    if (this._preventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("navigate", { detail: this.link }));
  }

  /* lifecycle */

  _userLocale;

  connectedCallback() {
    this._userLocale = getUserLocale();
  }
}
