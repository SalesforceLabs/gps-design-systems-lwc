import { LightningElement, api, track } from "lwc";
import { normalizeString } from "c/nswUtilsPrivate";

export default class NswDSCalloutBase extends LightningElement {
    _iconName = "info";

    @api get iconName() {
        return this._iconName;
    }

    set iconName(newValue) {
        this._iconName = normalizeString(newValue);
    }

    _title;

    @api get title() {
        return this._title;
    }

    set title(newValue) {
        this._title = normalizeString(newValue, { toLowerCase: false });
    }

    @api nswClass;
}