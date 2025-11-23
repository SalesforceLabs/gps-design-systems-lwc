import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const ACTIVEPAGE_DEFAULT = 1;
const LASTPAGE_DEFAULT = 1;
export default class SfGpsDsAuNswPagination extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    ariaLabel = "Pagination";
    // @ts-ignore
    @api
    srOnlyPre = "Page ";
    // @ts-ignore
    @api
    srOnlyPost;
    // @ts-ignore
    @api
    srOnlyPrevious = "Previous";
    // @ts-ignore
    @api
    srOnlyNext = "Next";
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    lastPage;
    _lastPage = this.defineIntegerProperty("lastPage", {
        defaultValue: LASTPAGE_DEFAULT
    });
    // @ts-ignore
    @api
    activePage;
    _activePage = this.defineIntegerProperty("activePage", {
        defaultValue: ACTIVEPAGE_DEFAULT
    });
    /* computed */
    get computedFirstPage() {
        return 1;
    }
    get computedPrevPage() {
        return this._activePage.value - 1;
    }
    get computedNextPage() {
        return this._activePage.value + 1;
    }
    get computedShowPrevious() {
        return this._activePage.value > 1;
    }
    get computedShowFirstPage() {
        return this._activePage.value > 2;
    }
    get computedShowPrevEllipsis() {
        return this._activePage.value > 3;
    }
    get computedShowPrevPage() {
        return this._activePage.value > 1;
    }
    get computedShowActivePage() {
        return this._lastPage.value > 0;
    }
    get computedShowNextPage() {
        return this._activePage.value < this._lastPage.value;
    }
    get computedShowNextEllipsis() {
        return this._activePage.value < this._lastPage.value - 2;
    }
    get computedShowLastPage() {
        return this._activePage.value < this._lastPage.value - 1;
    }
    get computedShowNext() {
        return this._activePage.value < this._lastPage.value;
    }
    get computedClassName() {
        return {
            "nsw-pagination": true,
            [this.className || ""]: !!this.className
        };
    }
    get computedPreviousDisabled() {
        return !this.computedShowPrevious;
    }
    get computedPrevPageClassName() {
        return {
            "nsw-icon-button": true,
            disabled: this.computedPreviousDisabled
        };
    }
    get computedNextDisabled() {
        return !this.computedShowNext;
    }
    get computedNextPageClassName() {
        return {
            "nsw-icon-button": true,
            disabled: this.computedNextDisabled
        };
    }
    /* event management */
    handlePreviousPageClick(event) {
        event.preventDefault();
        const activePage = this._activePage.value;
        if (activePage > 1) {
            this.dispatchEvent(new CustomEvent("pagechange", {
                detail: activePage - 1
            }));
        }
    }
    handleFirstPageClick(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("pagechange", {
            detail: 1
        }));
    }
    handleLastPageClick(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("pagechange", {
            detail: this._lastPage.value
        }));
    }
    handleNextPageClick(event) {
        event.preventDefault();
        if (this._activePage.value < this._lastPage.value) {
            this.dispatchEvent(new CustomEvent("pagechange", {
                detail: this._activePage.value + 1
            }));
        }
    }
}
