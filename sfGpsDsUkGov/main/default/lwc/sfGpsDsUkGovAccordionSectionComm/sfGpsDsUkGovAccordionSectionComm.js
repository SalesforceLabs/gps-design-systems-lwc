/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsUkGovAccordionSectionComm extends SfGpsDsLwc {
  @api index;
  @api header;
  @api content;
  @api className;

  // @api closed

  _closed = true;

  @api get closed() {
    return this._closed;
  }

  set closed(value) {
    this._closed = value;
  }

  /* event management */

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
    this.classList.add("govuk-scope");
  }

  renderedCallback() {
    let element = this.template.querySelector(MARKDOWN_SELECTOR);

    if (element) {
      replaceInnerHtml(element, this.content);
    }
  }
}
