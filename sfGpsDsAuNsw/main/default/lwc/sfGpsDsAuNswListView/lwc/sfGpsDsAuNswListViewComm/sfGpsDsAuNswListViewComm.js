import { api, track, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { getListInfoByName } from "lightning/uiListsApi";
import getListViewNameById from "@salesforce/apex/SfGpsDsListViewController.getListViewNameById";
import getCount from "@salesforce/apex/SfGpsDsListViewController.getCount";
import getRecords from "@salesforce/apex/SfGpsDsListViewController.getEnhancedRecords";
const LISTVIEW_OBJECTID = "00B";
const LISTVIEW_SETTINGS = "*#$LISTVIEW_SETTINGS";
const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswListViewComm";
export default class SfGpsDsAuNswListViewComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    objectApiName;
    // @ts-ignore
    @api
    pageSize = 10;
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
    className;
    // @ts-ignore
    @api
    titleClassName;
    // @ts-ignore
    @track
    _isLoading = false;
    /* api: filterName */
    _filterName;
    _filterNameOriginal;
    // @ts-ignore
    @api
    get filterName() {
        return this._filterNameOriginal;
    }
    set filterName(value) {
        this._filterNameOriginal = value;
        if (value && value.toString().startsWith(LISTVIEW_OBJECTID)) {
            getListViewNameById({ id: value })
                .then((result) => {
                this._filterName = result;
            })
                .catch((error) => {
                this.addError("CO-LV", "Error while getting list view name.");
                this._filterName = undefined;
                if (DEBUG) {
                    console.log("CO-LV", JSON.stringify(error));
                }
            });
        }
        else {
            this._filterName = value;
        }
    }
    _listInfo;
    _rawRecords;
    // @ts-ignore
    @wire(getListInfoByName, { objectApiName: "$objectApiName", listViewApiName: "$_filterName" })
    handleListInfo({ error, data }) {
        if (data) {
            this._listInfo = data;
            this._isLoading = true;
            if (this._listInfo == null)
                return;
            getCount({
                objectApiName: this._listInfo.listReference.objectApiName,
                filterLogicString: this._listInfo.filterLogicString,
                filteredByInfo: JSON.stringify(this._listInfo.filteredByInfo)
            })
                .then((result) => {
                this._itemsTotal = result;
                this._pageSize = this.pageSize;
                this._activePage = 1;
                this._lastPage = Math.ceil((this._itemsTotal || 0) / this._pageSize);
                this._itemsFrom = 1;
                this._isLoading = false;
                this._orderedByInfo = this._listInfo?.orderedByInfo;
                let sortOptions = (this._listInfo?.displayColumns || [])
                    .filter((column) => column.sortable)
                    .map((column) => ({
                    label: column.label,
                    value: column.fieldApiName
                }));
                this._sortOptions = [
                    { label: "List view default", value: LISTVIEW_SETTINGS },
                    ...sortOptions
                ];
                this._sortValue = LISTVIEW_SETTINGS;
                this.updateRecords();
            })
                .catch((errorc) => {
                this.addError("CO-QC", "Query count error.");
                if (DEBUG)
                    console.debug(CLASS_NAME, `Query count error ${errorc}`);
                this._itemsTotal = 0;
                this._pageSize = this.pageSize;
                this._lastPage = 1;
                this._activePage = 1;
                this._itemsFrom = 0;
                this._isLoading = false;
                this.updateRecords();
            });
        }
        else if (error) {
            this.addError("CO-LI", "Issue while getting list view info");
            if (DEBUG)
                console.debug(CLASS_NAME, "List view error", JSON.stringify(error));
            this._listInfo = undefined;
            this.updateRecords();
        }
    }
    _records;
    // @ts-ignore
    @track
    _name;
    // @ts-ignore
    @track
    _itemsTotal;
    // @ts-ignore
    @track
    _pageSize = 10;
    // @ts-ignore
    @track
    _lastPage;
    // @ts-ignore
    @track
    _itemsFrom = 1;
    // @ts-ignore
    @track
    _itemsTo;
    // @ts-ignore
    @track
    _activePage = 1;
    // @ts-ignore
    @track
    _sortValue;
    // @ts-ignore
    @track
    _sortOptions;
    // @ts-ignore
    @track
    _displayColumns;
    // @ts-ignore
    @track
    _orderedByInfo; // current orderedBy clause
    /* computed */
    get navSvc() {
        return this.refs.navsvc;
    }
    /* methods */
    updateRecords() {
        if (this._listInfo == null || this._itemsTotal === 0) {
            this._rawRecords = undefined;
            this.updateVisibleRecords();
            return;
        }
        this._isLoading = true;
        getRecords({
            objectApiName: this._listInfo.listReference.objectApiName,
            displayColumns: JSON.stringify(this._listInfo.displayColumns),
            filterLogicString: this._listInfo.filterLogicString,
            filteredByInfo: JSON.stringify(this._listInfo.filteredByInfo),
            orderedByInfo: JSON.stringify(this._orderedByInfo),
            offset: this._itemsFrom - 1,
            pageSize: this._pageSize
        })
            .then((result) => {
            this._rawRecords = result;
            this._isLoading = false;
            this.updateVisibleRecords();
        })
            .catch((error2) => {
            this.addError("CO-GR", "Issue while getting records");
            if (DEBUG)
                console.log(CLASS_NAME, "getRecords error", JSON.stringify(error2));
            this._rawRecords = undefined;
            this._isLoading = false;
            this.updateVisibleRecords();
        });
    }
    updateVisibleRecords() {
        if (this._rawRecords == null || this._listInfo == null) {
            this._records = null;
            return;
        }
        this._name = this._listInfo.label;
        this._displayColumns = this._listInfo.displayColumns.map((column) => ({
            ...column
        }));
        this._records = this._rawRecords;
        this._itemsTo = this._itemsFrom + this._records.length - 1;
    }
    handlePageChange(event) {
        let formerActivePage = this._activePage;
        this._activePage = Math.max(1, Math.min(event.detail, this._lastPage || 0));
        this._itemsFrom = (this._activePage - 1) * this._pageSize + 1;
        if (formerActivePage !== this._activePage) {
            this.updateRecords();
        }
    }
    handleResultsBarChange(event) {
        let fieldApiName = event.detail;
        if (fieldApiName === LISTVIEW_SETTINGS) {
            this._orderedByInfo = this._listInfo?.orderedByInfo;
            this._activePage = 1;
            this._itemsFrom = 1;
            this._sortValue = LISTVIEW_SETTINGS;
            this.updateRecords();
        }
        else {
            let dc = this._listInfo?.displayColumns || [];
            for (let i = 0; i < dc.length; i++) {
                if (dc[i].fieldApiName === fieldApiName) {
                    this._orderedByInfo = [
                        {
                            fieldApiName: fieldApiName,
                            isAscending: true,
                            label: dc[i].label
                        }
                    ];
                    this._activePage = 1;
                    this._itemsFrom = 1;
                    this._sortValue = fieldApiName;
                    this.updateRecords();
                    break;
                }
            }
        }
    }
    handleItemNavigate(event) {
        const navsvc = this.navSvc;
        if (navsvc) {
            navsvc.navigateTo("standard__recordPage", {
                objectApiName: event.detail.objectApiName || this.objectApiName,
                recordId: event.detail.recordId,
                actionName: "view"
            });
        }
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
    _rendered = false;
    renderedCallback() {
        super.renderedCallback?.();
        const items = this.template?.querySelectorAll(".item:not([data-link])");
        const navsvc = this.navSvc;
        if (!items ||
            items.length === 0 ||
            !navsvc) {
            return;
        }
        for (let i = 0; i < items.length; i++) {
            const viewItem = items[i];
            if (viewItem.recordId) {
                navsvc
                    .generateUrl("standard__recordPage", {
                    objectApiName: this.objectApiName,
                    recordId: viewItem.recordId,
                    actionName: "view"
                })
                    .then((url) => {
                    viewItem.dataset.link = url;
                    viewItem.link = url;
                });
            }
        }
    }
}
