import { api } from "lwc";
import sfGpsDsTabSetLwr from "c/sfGpsDsTabSetLwr";
const FIRSTCHILD_DEFAULT = false;
export default class sfGpsDsAuNswTabSetLwr extends sfGpsDsTabSetLwr {
    static renderMode = "light";
    // @ts-ignore
    @api
    firstChild;
    _firstChild = this.defineBooleanProperty("firstChild", {
        defaultValue: FIRSTCHILD_DEFAULT
    });
    // getters
    get computedClassName() {
        return {
            [this.className || ""]: !!this.className,
            "nsw-tabs": true
        };
    }
}
