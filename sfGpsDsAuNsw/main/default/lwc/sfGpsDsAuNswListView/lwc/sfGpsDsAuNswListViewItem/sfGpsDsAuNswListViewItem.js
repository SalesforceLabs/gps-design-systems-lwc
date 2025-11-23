import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswListViewItem";
export default class SfGpsDsAuNswListViewItem extends SfGpsDsElement {
    _displayColumns;
    // @ts-ignore
    @api
    get displayColumns() {
        return this._displayColumns;
    }
    set displayColumns(value) {
        this._displayColumns = value;
        this.reconcile();
    }
    _record;
    // @ts-ignore
    @api
    get record() {
        return this._record;
    }
    set record(value) {
        this._record = value;
        this.reconcile();
    }
    // @ts-ignore
    @api
    recordId;
    // @ts-ignore
    @api
    labelColumn;
    // @ts-ignore
    @api
    titleColumn;
    // @ts-ignore
    @api
    dateColumn;
    // @ts-ignore
    @api
    tagsColumn;
    // @ts-ignore
    @api
    imageColumn;
    // @ts-ignore
    @api
    imageAltColumn;
    // @ts-ignore
    @api
    link;
    // @ts-ignore
    @track
    _reconciledRecord;
    reconcile() {
        if (this._record && this._displayColumns) {
            if (DEBUG)
                console.debug(CLASS_NAME, "> reconcile", JSON.stringify(this._displayColumns), JSON.stringify(this._record));
            this._reconciledRecord = this._displayColumns.map((column) => {
                let { value, displayValue, dataType, relationshipObjectApiName, relationshipId } = this.getColumnDetails(column.fieldApiName);
                let rv = {
                    ...column,
                    value: value,
                    displayValue: displayValue || "",
                    label: column.label,
                    isBoolean: dataType === "BOOLEAN",
                    isCurrency: dataType === "CURRENCY",
                    isDate: dataType === "DATE",
                    isDateTime: dataType === "DATETIME",
                    isEmail: dataType === "EMAIL",
                    isNumber: dataType ? ["INTEGER", "DOUBLE"].includes(dataType) : false,
                    isPercent: dataType === "PERCENT",
                    isPhone: dataType === "PHONE",
                    isPicklist: dataType ? ["PICKLIST", "MULTIPICKLIST"].includes(dataType) : false,
                    isReference: dataType === "REFERENCE",
                    isString: dataType ? ["ENCRYPTEDSTRING", "ID", "STRING", null].includes(dataType) : false,
                    isTextArea: dataType === "TEXTAREA",
                    isTime: dataType === "TIME",
                    isURL: dataType === "URL"
                };
                switch (dataType) {
                    case "EMAIL":
                        rv.link = `mailto:${value}`;
                        break;
                    case "PHONE":
                        rv.link = `tel:${value}`;
                        break;
                    case "URL":
                        rv.link = value;
                        break;
                    case "STRING":
                        if (relationshipId) {
                            rv.link = `#${relationshipId}`;
                            rv.relationshipId = relationshipId;
                            rv.relationshipObjectApiName = relationshipObjectApiName;
                        }
                        break;
                    default:
                        break;
                }
                return rv;
            });
        }
    }
    /* returns only the reconciledRecord columns NOT used for mapping to the list item attributes */
    get _filteredRecord() {
        return this._reconciledRecord
            ? this._reconciledRecord.filter((column) => !this.isUsedForMapping(column.fieldApiName))
            : undefined;
    }
    get _label() {
        if (!this.labelColumn)
            return undefined;
        return this.getColumnDetails(this.labelColumn).displayValue;
    }
    get _title() {
        if (!this.titleColumn)
            return undefined;
        return this.getColumnDetails(this.titleColumn).displayValue;
    }
    get _date() {
        if (!this.dateColumn)
            return undefined;
        return this.getColumnDetails(this.dateColumn).value;
    }
    get _tags() {
        if (!this.tagsColumn)
            return undefined;
        let tags = this.getColumnDetails(this.tagsColumn).value;
        return tags
            ? tags.toString()
                .split(";")
                .map((value) => ({ text: value }))
            : undefined;
    }
    get _image() {
        if (!this.imageColumn)
            return undefined;
        return this.getColumnDetails(this.imageColumn).value;
    }
    get _imageAlt() {
        if (!this.imageAltColumn)
            return undefined;
        return this.getColumnDetails(this.imageAltColumn).displayValue;
    }
    get space() {
        return " ";
    }
    isUsedForMapping(fieldApiName) {
        return [
            this.labelColumn,
            this.titleColumn,
            this.dateColumn,
            this.tagsColumn,
            this.imageColumn,
            this.imageAltColumn
        ].some((name) => name === fieldApiName);
    }
    getColumnDetails(fieldApiName) {
        if (!fieldApiName || !this._record) {
            return {
                displayValue: undefined,
                value: null,
                dataType: undefined,
                relationshipObjectApiName: undefined,
                relationshipId: undefined
            };
        }
        let field = this._record.columns[fieldApiName];
        return {
            displayValue: field?.displayValue || field?.value,
            value: field?.value,
            dataType: field?.dataType,
            relationshipObjectApiName: field?.relationshipObjectApiName,
            relationshipId: field?.relationshipId
        };
    }
    handleRelationshipNavigate(event) {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target;
        this.dispatchEvent(new CustomEvent("navigate", {
            detail: {
                objectApiName: target.dataset.object,
                recordId: target.dataset.rid
            }
        }));
    }
    // eslint-disable-next-line no-unused-vars
    handleNavigate(_event) {
        this.dispatchEvent(new CustomEvent("navigate", {
            detail: {
                // leaving objectApiName for parent to apply
                recordId: this._record?.columns?.Id?.value
            }
        }));
    }
}
