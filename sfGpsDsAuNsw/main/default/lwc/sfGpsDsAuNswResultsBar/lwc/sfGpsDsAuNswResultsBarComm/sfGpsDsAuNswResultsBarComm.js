import { api, track } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswResultsBarComm";
export default class SfGpsDsAuNswResultsBarComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    from = 1;
    // @ts-ignore
    @api
    to = 10;
    // @ts-ignore
    @api
    total = 5917;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @track
    _value;
    /* api: sortOptions */
    _sortOptions;
    _sortOptionsOriginal;
    // @ts-ignore
    @api
    get sortOptions() {
        return this._sortOptionsOriginal;
    }
    set sortOptions(value) {
        this._sortOptionsOriginal = value;
        if (value == null || value === "") {
            this._sortOptions = undefined;
            this._value = undefined;
            return;
        }
        try {
            this._sortOptions = JSON.parse(value);
        }
        catch (e) {
            this._sortOptions = value
                .toString()
                .split(";")
                .map((option) => ({
                value: option,
                label: option
            }));
            if (DEBUG)
                console.debug(CLASS_NAME, "sortOptions", e);
        }
        if (isArray(this._sortOptions)) {
            this._value = this._sortOptions[0]?.value;
        }
    }
    /* event management */
    handleChange(event) {
        this._value = event.detail;
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
