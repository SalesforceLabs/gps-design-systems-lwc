/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVic2FormFileOsN.html";

export default class extends SfGpsDsFormFileOsN {
  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this._showValidation,
      valid: !this._showValidation,
      required: this._propSetMap.required
    });
  }

  @track computedAriaDescribedBy;

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      this.template.querySelector(".hint")?.id,
      this.template.querySelector(".help-block")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdsauvic2-read-only";
    this.classList.add("rpl-form__outer");
    this.hostElement.style.display = "block";
  }
}
