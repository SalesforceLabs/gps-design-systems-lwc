import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
const HEADINGLEVEL_DEFAULT = 2;
const FILLED_DEFAULT = false;
export default class SfGpsDsAuNswStepsItem extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    content;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    headingLevel;
    _headingLevel = this.defineIntegerProperty("headingLevel", {
        minValue: 2,
        maxValue: 4,
        defaultValue: HEADINGLEVEL_DEFAULT
    });
    // @ts-ignore
    @api
    filled;
    _filled = this.defineBooleanProperty("filled", {
        defaultValue: FILLED_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-steps__item": true,
            "nsw-steps__item--fill": this._filled.value,
            [this.className || ""]: !!this.className
        };
    }
    get _isH3() {
        return this._headingLevel.value === 3;
    }
    get _isH4() {
        return this._headingLevel.value === 4;
    }
    /* lifecycle */
    renderedCallback() {
        super.renderedCallback?.();
        if (this.refs.content) {
            replaceInnerHtml(this.refs.content, this.content || "");
        }
    }
}
