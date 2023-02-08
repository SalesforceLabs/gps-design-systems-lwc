/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwcOsN from "c/sfGpsDsLwcOsN";

export default class SfGpsDsAuNswProgressIndicatorCommOs extends SfGpsDsLwcOsN {
  @api step = 1;
  @api of = 1;
  @api className;
}