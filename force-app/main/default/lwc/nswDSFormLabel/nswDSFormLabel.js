import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from "c/nswUtilsPrivate"

export default class NswDSFormLabel extends LightningElement {
    @api label = "Label"

    get hasLabel() {
        return this.label != null && this.label.toString().length > 0;
    }

    // ---- required
    @track _required = false;

    @api get required() {
        return this._required;
    }
    
    set required(value) {
        this._required = normalizeBoolean(value);
    }

    
    // ---- helper: string
    _helper = "";
    _helperText = "";

    @api get helper() {
        return this._helper;
    }

    set helper(value) {
        this._helper = value;
        this._helperText = value ? value.toString() : "";
    }

    hasHelper() {
        return this._helperText.length > 0;
    }

}