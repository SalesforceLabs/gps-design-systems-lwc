/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwcOsN";
import { replaceInnerHtml } from "c/sfGpsDsHelpersOs";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuNswAccordionComm extends SfGpsDsLwc {
  @api index; // only used if part of a group
  @api header;

  // closed

  _closed = true;

  @api get closed() {
    return this._closed;
  }

  set closed(value) {
    this._closed = value;
  }

  @api content;
  @api className;

  _rendered = false;

  renderedCallback() {
    let element = this.template.querySelector(MARKDOWN_SELECTOR);

    if (element) {
      replaceInnerHtml(element, this.content);
    }
  }

  handleExpand() {
    this._closed = false;
    this.dispatchEvent(new CustomEvent("expand"));
  }

  handleCollapse() {
    this._closed = true;
    this.dispatchEvent(new CustomEvent("collapse"));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
