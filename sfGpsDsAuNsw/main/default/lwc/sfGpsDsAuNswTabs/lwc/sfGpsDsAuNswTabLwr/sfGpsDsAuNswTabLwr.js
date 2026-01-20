import { api } from "lwc";
import SfGpsDsTabLwr from "c/sfGpsDsTabLwr";
const DISABLELAZYLOADING_DEFAULT = false;
export default class SfGpsDsAuNswTabLwr extends SfGpsDsTabLwr {
    static renderMode = "light";
    // @ts-ignore
    @api
    disableLazyLoading = DISABLELAZYLOADING_DEFAULT;
    _disableLazyLoading = this.defineBooleanProperty("disableLazyLoading", {
        defaultValue: DISABLELAZYLOADING_DEFAULT
    });
    /* computed */
    get computedClassName() {
        return {
            ...super.computedClassName,
            "nsw-tabs__content": true
        };
    }
    get computedLoadContent() {
        return this._loadContent || this._disableLazyLoading.value;
    }
}
