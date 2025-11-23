/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import mdEngine from "c/sfGpsDsMarkdown";
import communityId from "@salesforce/community/Id";
import cBasePath from "@salesforce/community/basePath";
const DEBUG = false;
const CLASS_NAME = "SfGpsDsLwc";
export default class SfGpsDsLwc extends SfGpsDsElement {
    _isAura = false;
    _isLwrOnly = false; // can be set in the constructor of subclasses
    constructor(isLwrOnly = false) {
        super();
        this._isLwrOnly = isLwrOnly;
    }
    /* getters */
    get communityId() {
        return communityId;
    }
    get communityBasePath() {
        return cBasePath;
    }
    get isPreview() {
        return !document.URL.startsWith(cBasePath);
    }
    /* methods: error management */
    // @ts-ignore
    @track
    _sfGpsDsErrors;
    addError(code, description) {
        let errors = this._sfGpsDsErrors || [];
        this._sfGpsDsErrors = [
            ...errors,
            {
                index: errors.length,
                code: code,
                description: description
            }
        ];
    }
    clearErrors() {
        this._sfGpsDsErrors = undefined;
    }
    // @ts-ignore
    @api
    getErrors() {
        return this._sfGpsDsErrors;
    }
    /* methods: markdown attributes */
    defineMarkdownContentProperty(propertyName, options) {
        const safeOptions = options || {};
        return this.defineProperty(propertyName, {
            ...options,
            transform: (markdown) => {
                try {
                    return markdown ? mdEngine.renderEscaped(markdown) : "";
                    // eslint-disable-next-line no-unused-vars
                }
                catch (e) {
                    this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
                    return null;
                }
            }
        });
    }
    defineMarkdownUnpackedFirstPProperty(propertyName, options) {
        const safeOptions = options || {};
        return this.defineProperty(propertyName, {
            ...options,
            transform: (markdown) => {
                try {
                    return markdown ? mdEngine.renderEscapedUnpackFirstP(markdown) : "";
                    // eslint-disable-next-line no-unused-vars
                }
                catch (e) {
                    this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
                    return null;
                }
            }
        });
    }
    defineMarkdownFirstLinkProperty(propertyName, options) {
        const safeOptions = options || {};
        return this.defineProperty(propertyName, {
            ...options,
            transform: (markdown) => {
                try {
                    return markdown ? mdEngine.extractFirstLink(markdown) : "";
                    // eslint-disable-next-line no-unused-vars
                }
                catch (e) {
                    this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
                    return null;
                }
            }
        });
    }
    defineMarkdownLinksProperty(propertyName, options) {
        const safeOptions = options || {};
        return this.defineProperty(propertyName, {
            ...options,
            transform: (markdown) => {
                try {
                    return markdown ? mdEngine.extractLinks(markdown) : (safeOptions.defaultValue || "");
                    // eslint-disable-next-line no-unused-vars
                }
                catch (e) {
                    this.addError(safeOptions.errorCode || "MD-CO", safeOptions.errorText || `Issue when parsing ${propertyName} markdown.`);
                    return null;
                }
            }
        });
    }
    /* lifecycle */
    connectedCallback() {
        if (DEBUG)
            console.debug(CLASS_NAME, "> connectedCallback");
        super.connectedCallback?.();
        // @ts-ignore
        // eslint-disable-next-line dot-notation
        if (window["$A"] !== undefined && window["$A"] !== null) {
            this._isAura = true;
            if (this._isLwrOnly) {
                this.addError("CO-AU", "This element is not compatible with Aura communities.");
            }
        }
        if (DEBUG)
            console.debug(CLASS_NAME, "< connectedCallback");
    }
}
