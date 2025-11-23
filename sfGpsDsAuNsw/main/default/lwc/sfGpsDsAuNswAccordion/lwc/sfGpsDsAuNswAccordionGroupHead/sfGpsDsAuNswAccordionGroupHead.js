/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const SHOWBUTTONS_DEFAULT = false;
const ISFULLYEXPANDED_DEFAULT = false;
const ISFULLYCOLLAPSED_DEFAULT = false;
const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswAccordionGroupHead";
export default class SfGpsDsAuNswAccordionGroupHead extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    expandAllLabel;
    // @ts-ignore
    @api
    collapseAllLabel;
    // @ts-ignore
    @api
    showButtons;
    _showButtons = this.defineBooleanProperty("showButtons", {
        defaultValue: SHOWBUTTONS_DEFAULT
    });
    // @ts-ignore
    @api
    isFullyExpanded;
    _isFullyExpanded = this.defineBooleanProperty("isFullyExpanded", {
        defaultValue: ISFULLYEXPANDED_DEFAULT
    });
    // @ts-ignore
    @api
    isFullyCollapsed;
    _isFullyCollapsed = this.defineBooleanProperty("isFullyCollapsed", {
        defaultValue: ISFULLYCOLLAPSED_DEFAULT
    });
    /* event management */
    // eslint-disable-next-line no-unused-vars
    handleExpandAll(_event) {
        if (DEBUG)
            console.debug(CLASS_NAME, "> handleExpandAll");
        this.dispatchEvent(new CustomEvent("expandall"));
        if (DEBUG)
            console.debug(CLASS_NAME, "< handleExpandAll");
    }
    // eslint-disable-next-line no-unused-vars
    handleCollapseAll(_event) {
        if (DEBUG)
            console.debug(CLASS_NAME, "> handleCollapseAll");
        this.dispatchEvent(new CustomEvent("collapseall"));
        if (DEBUG)
            console.debug(CLASS_NAME, "< handleCollapseAll");
    }
}
