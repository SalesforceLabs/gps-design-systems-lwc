/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpersOs";

const options = {
  info: "nsw-in-page-alert--info",
  warning: "nsw-in-page-alert--warning",
  error: "nsw-in-page-alert--error",
  success: "nsw-in-page-alert--success"
};

const icons = {
  info: "info",
  warning: "error",
  error: "cancel",
  success: "check_circle"
};

export default class SfGpsDsAuNswAlert extends LightningElement {
  static renderMode = "light";

  @api title;
  @api className = "";
  @api as = "info";
  @api compact = false;

  /* computed */

  get computedClassName() {
    return computeClass({
      "nsw-in-page-alert": true,
      "nsw-in-page-alert--compact": this.compact,
      [options[this.as]]: this.as,
      [this.className]: this.className
    });
  }

  get computedIconName() {
    return icons[this.as];
  }

  get space() {
    return " ";
  }
}
