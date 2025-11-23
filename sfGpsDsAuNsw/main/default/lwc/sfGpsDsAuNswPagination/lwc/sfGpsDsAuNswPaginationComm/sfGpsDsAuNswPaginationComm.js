import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
export default class SfGpsDsAuNswPaginationComm extends SfGpsDsLwc {
    // @ts-ignore
    @api
    className;
    /* api: activePage, Integer */
    _currentActivePage;
    _activePage;
    // @ts-ignore
    @api
    get activePage() {
        return this._activePage;
    }
    set activePage(value) {
        this._activePage = value;
        this._currentActivePage = Math.max(1, value);
    }
    /* api: lastPage, Integer */
    _currentLastPage;
    _lastPage;
    // @ts-ignore
    @api
    get lastPage() {
        return this._lastPage;
    }
    set lastPage(value) {
        this._lastPage = value;
        this._currentLastPage = Math.max(1, value);
        if ((this._currentActivePage || 1) > this._currentLastPage) {
            this._currentActivePage = this._currentLastPage;
        }
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
    /* events */
    handlePageChange(event) {
        if (event.detail > 0 && event.detail <= (this.lastPage || 0)) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.activePage = event.detail;
        }
    }
}
