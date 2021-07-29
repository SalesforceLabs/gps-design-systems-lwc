import { LightningElement, api, track } from "lwc";
import { normalizeISODate } from "c/nswInternationalizationLibrary";

export default class NswDSListItemBase extends LightningElement {
    @api tag;
    @api titleLabel;
    @api titleUrl;
    @api content;
    @api nswClass;

    
    // -- dateIso: String in ISO date format or
    // --        : Date

    _date;
    @track _dateIso;
    @track _dateText;

    @api get date() {
        return this._date;
    }
    
    set date(date) {
        this._date = date;
        let nd = normalizeISODate(date);
        this._dateIso = nd.isoValue;
        this._dateText = nd.displayValue;
    }

    


    // ---- tag: String

    @api tags;


    // ---- imageUrl: String url
    // ---- imageAlt: String text

    @api imageReversed = false;
    @api imageSrc;
    @api imageAlt;


    // ----- 
    
    get computedLinkClass() {
        return "nsw-list-item" + (this.imageReversed ? " nsw-list-item--reversed" : "");
    }
}