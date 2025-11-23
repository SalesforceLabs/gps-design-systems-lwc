import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const TITLEPREVENTDEFAULT_DEFAULT = false;
export default class sfGpsDsAuNswHeroBannerAlt extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    titleUrl;
    // @ts-ignore
    @api
    titleLabel;
    // @ts-ignore
    @api
    imageSrc;
    // @ts-ignore
    @api
    imageAlt;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    titlePreventDefault;
    _titlePreventDefault = this.defineBooleanProperty("titlePreventDefault", {
        defaultValue: TITLEPREVENTDEFAULT_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-hero-banner-alt": true,
            [this.className || ""]: !!this.className
        };
    }
    /* event management */
    handleTitleClick(event) {
        if (this._titlePreventDefault.value) {
            event.preventDefault();
        }
        this.dispatchEvent(new CustomEvent("navclick", {
            detail: event.target.href
        }));
    }
}
