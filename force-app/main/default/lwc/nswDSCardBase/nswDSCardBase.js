import { LightningElement, api, track } from "lwc";
import { normalizeISODate } from "c/nswInternationalizationLibrary";

export default class NswDSCardBase extends LightningElement {
    @api titleLabel;
    @api titleUrl;
    @api content;
    @api nswClass;

    
    // ---- isHeadline: Boolean
    @api isHeadline = false;

    // -- dateIso: String in ISO date format or
    // --        : Date

    _date;
    @track _dateIso;
    @track _dateText;

    @api set date(date) {
        this._date = date;
        let nd = normalizeISODate(date);
        this._dateIso = nd.isoValue;
        this._dateText = nd.displayValue;
    }

    get date() {
        return this._date;
    }


    // ---- tag: String

    @api tag;


    // ---- imageUrl: String url
    // ---- imageAlt: String text

    @api imageSrc;
    @api imageAlt;


    // ----- 
    
    get computedCardClass() {
        return "nsw-card" + (this.isHeadline ? " nsw-card--headline" : "");
    }
}