import { LightningElement, api, track } from 'lwc';
import { normalizeString } from 'c/nswUtilsPrivate';

export default class NswDSBannerBase extends LightningElement {
    @api isDark = false;
    @api isWide = false;
    @api hasLinks = false;

    get computedBannerClass() {
        return "nsw-banner" + (this.isDark ? " nsw-banner--dark" : "")
                            + (this.isWide ? " nsw-banner--wide" : "");
    }

    get computedButtonClass() {
        return "nsw-button" + (this.isDark ? " nsw-button--white" : " nsw-button--primary");
    }


    // ---- buttonLabel and buttonUrl

    @track _buttonLabel;
    @track _buttonUrl;

    @api get buttonLabel() {
        return this._buttonLabel;
    }

    set buttonLabel(label) {
        this._buttonLabel = normalizeString(label, { toLowerCase: false });
        
    }
   
    @api get buttonUrl() {
        return this._buttonUrl;
    }

    set buttonUrl(url) {
        this._buttonUrl = normalizeString(url, { toLowerCase: false });
    }

    

    // ---- title

    _title;

    @api get title() {
        return this._title;
    }

    set title(t) {
        this._title = normalizeString(t, { toLowerCase: false });;
    }


    // ---- subtitle

    _subtitle;

    @api get subtitle() {
        return this._subtitle;
    }

    set subtitle(st) {
        this._subtitle = normalizeString(st, { toLowerCase: false });
    }

    
    @api imageSrc;
    @api imageAlt;
}