import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { uniqueId, isArray, formatTemplate } from "c/sfGpsDsHelpers";
const FROM_DEFAULT = 0;
const TO_DEFAULT = 0;
const TOTAL_DEFAULT = 0;
const VALUE_DEFAULT = null;
export default class SfGpsDsAuNswResultsBar extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    name;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    from;
    _from = this.defineIntegerProperty("from", {
        minValue: 0,
        defaultValue: FROM_DEFAULT
    });
    // @ts-ignore
    @api
    to;
    _to = this.defineIntegerProperty("to", {
        minValue: 0,
        defaultValue: TO_DEFAULT
    });
    // @ts-ignore
    @api
    total;
    _total = this.defineIntegerProperty("total", {
        minValue: 0,
        defaultValue: TOTAL_DEFAULT
    });
    // @ts-ignore
    @api
    noResultText = "Sorry, no results found for your search";
    // @ts-ignore
    @api
    resultsText = "Showing results {from} - {to} of {total} results";
    // @ts-ignore
    @api
    value;
    _value = this.defineStringProperty("value", {
        defaultValue: VALUE_DEFAULT,
        watcher: () => this.reconcileValueOptions()
    });
    /* api: sortOptions */
    _sortOptions;
    _sortOptionsOriginal;
    _visibleSortOptions;
    // @ts-ignore
    @api
    get sortOptions() {
        return this._sortOptionsOriginal;
    }
    set sortOptions(value) {
        this._sortOptionsOriginal = value;
        if (value == null) {
            this._sortOptions = undefined;
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.value = undefined;
        }
        else if (isArray(value)) {
            this._sortOptions = value.map((option) => ({
                ...option,
                label: option.label,
                value: option.value,
                selected: option.selected
            }));
        }
        else {
            this._sortOptions = [value];
        }
        this.reconcileValueOptions();
    }
    /* computed */
    get computedClassName() {
        return {
            "nsw-results-bar": true,
            [this.className || ""]: !!this.className
        };
    }
    _selectId;
    get computedSelectId() {
        if (this._selectId === undefined) {
            this._selectId = uniqueId("sf-gps-ds-au-nsw-results-bar-select");
        }
        return this._selectId;
    }
    get computedResultsText() {
        return this.resultsText
            ? formatTemplate(this.resultsText, {
                from: this._from.value?.toString(),
                to: this._to.value?.toString(),
                total: this._total.value?.toString()
            })
            : null;
    }
    /* methods */
    reconcileValueOptions() {
        if (this._sortOptions == undefined) {
            this._visibleSortOptions = undefined;
            return;
        }
        if (this._value.value == null && this._sortOptions[0]) {
            this.value = this._sortOptions[0].value;
        }
        this._visibleSortOptions = this._sortOptions.map((option) => ({
            ...option,
            selected: option.value === this._value.value
        }));
    }
    /* event management */
    handleSelectChange(event) {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.value = target.value;
        this.dispatchEvent(new CustomEvent("change", { detail: target.value }));
    }
}
