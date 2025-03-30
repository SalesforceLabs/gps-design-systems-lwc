/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api className = "";

  @track disabled = true;

  /* event management */

  handleChange(event) {
    console.log('--> handleChange ', JSON.stringify(event.target.value));
  }
  
  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
