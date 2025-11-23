import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";
import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";
import cBasePath from "@salesforce/community/basePath";
const MENUOPEN_DEFAULT = false;
/**
 * @slot MenuContents
 */
export default class SfGpsDsAuVic2AppNavbar extends SfGpsDsLwc {
    static renderMode = "light";
    // @ts-ignore
    @api
    logoSrc;
    // @ts-ignore
    @api
    logoAlt;
    // @ts-ignore
    @api
    sectionTitle;
    // @ts-ignore
    @api
    sectionColor;
    // @ts-ignore
    @track
    _focusTrapActivated;
    // @ts-ignore
    @track
    _isMenuOpen = MENUOPEN_DEFAULT;
    get isMenuOpen() {
        return this._isMenuOpen;
    }
    set isMenuOpen(value) {
        this._isMenuOpen = value;
        this.watchIsMenuOpen();
    }
    /* computed */
    get computedStyle() {
        return computeClass({
            [`--docs-header-color: ${this.sectionColor}`]: this.sectionColor
        }, ";");
    }
    get computedMenuStyle() {
        return computeClass({
            "--local-vertical-nav-background: transparent": true,
            "--local-vertical-nav-item-gutter: var(--rpl-sp-3)": true,
            "--local-vertical-nav-hover-bg: var(--rpl-clr-neutral-300)": true
        }, ";");
    }
    get computedLogoSrc() {
        return (this.logoSrc || `${STATIC_RESOURCE}/assets/logos/logo-vic-gov.svg#logo`);
    }
    get computedLogoAlt() {
        return this.logoAlt || "Government of Victoria Logo";
    }
    get computedHref() {
        return cBasePath || "/";
    }
    /* methods */
    watchIsMenuOpen() {
        const isOpen = this._isMenuOpen;
        if (isOpen) {
            // activateFocusTrap
            this._focusTrapActivated = true;
            document.body.classList.add("rpl-u-viewport-locked");
            window.scroll(0, 0);
        }
        else {
            // deactivateFocusTrap
            this._focusTrapActivated = false;
            document.body.classList.remove("rpl-u-viewport-locked");
        }
    }
    /* event management */
    handleCloseMenu() {
        this.isMenuOpen = false;
    }
    handleToggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
    handleEscapeKey(event) {
        if (event.code === "Escape") {
            this.handleCloseMenu();
        }
    }
    handleNavigate(event) {
        event.stopPropagation();
        this.isMenuOpen = false;
    }
    /* lifecycle */
    constructor() {
        super(true); // isLwrOnly
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("vic2-scope");
    }
    disconnectedCallback() {
        if (this._focusTrapActivated) {
            document.body.classList.remove("rpl-u-viewport-locked");
        }
    }
}
