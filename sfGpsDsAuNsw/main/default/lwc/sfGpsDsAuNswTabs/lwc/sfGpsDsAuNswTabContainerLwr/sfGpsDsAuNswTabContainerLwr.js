import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const TABPADDINGSTYLE_DEFAULT = "full";
const TABPADDINGSTYLE_VALUES = {
    full: "",
    flush: "nsw-tabs__content--flush",
    "side-flush": "nsw-tabs__content--side-flush"
};
const TABBORDERSTYLE_DEFAULT = "border";
const TABBORDERSTYLE_VALUES = {
    border: "",
    "no-border": "nsw-tabs__content--no-border"
};
const FIRSTCHILD_DEFAULT = false;
/**
 * @slot Tab1
 * @slot Tab2
 * @slot Tab3
 * @slot Tab4
 * @slot Tab5
 * @slot Tab6
 * @slot Tab7
 * @slot Tab8
 * @slot Tab9
 * @slot Tab10
 */
export default class SfGpsDsAuNswTabContainerLwr extends SfGpsDsLwc {
    // @ts-ignore
    @api
    title = "";
    // @ts-ignore
    @api
    tab1Label;
    // @ts-ignore
    @api
    tab2Label;
    // @ts-ignore
    @api
    tab3Label;
    // @ts-ignore
    @api
    tab4Label;
    // @ts-ignore
    @api
    tab5Label;
    // @ts-ignore
    @api
    tab6Label;
    // @ts-ignore
    @api
    tab7Label;
    // @ts-ignore
    @api
    tab8Label;
    // @ts-ignore
    @api
    tab9Label;
    // @ts-ignore
    @api
    tab10Label;
    // @ts-ignore
    @api
    // @ts-ignore
    firstChild = FIRSTCHILD_DEFAULT;
    // @ts-ignore
    @api
    tabPaddingStyle;
    _tabPaddingStyle = this.defineEnumObjectProperty("tabPaddingStyle", {
        validValues: TABPADDINGSTYLE_VALUES,
        defaultValue: TABPADDINGSTYLE_DEFAULT
    });
    // @ts-ignore
    @api
    tabBorderStyle;
    _tabBorderStyle = this.defineEnumObjectProperty("tabBorderStyle", {
        validValues: TABBORDERSTYLE_VALUES,
        defaultValue: TABBORDERSTYLE_DEFAULT
    });
    /* computed */
    get computedTabClassName() {
        return {
            "nsw-tabs__content": true,
            [this._tabPaddingStyle.value]: !!this._tabPaddingStyle.value,
            [this._tabBorderStyle.value]: !!this._tabBorderStyle.value
        };
    }
    /* lifecycle */
    constructor() {
        super(true);
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
