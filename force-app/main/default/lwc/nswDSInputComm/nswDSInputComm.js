import { LightningElement, api } from "lwc";
import { generateUniqueId } from "c/nswInputUtils";

export default class NswDSInputComm extends LightningElement {
    @api label="Input";
    @api name = generateUniqueId();
    @api isLegend = false;
    @api helper;
    @api placeholder;

    @api autocomplete;
    @api dateStyle;
    @api timeStyle;
    @api formatter;
    @api type;
    @api isLoading = false;
    @api pattern;
    @api maxLength;
    @api minLength;
    @api accept;
    @api max;
    @api min;
    @api step;
    @api checked = false;
    @api multiple = false;
    @api value;
    @api disabled = false;
    @api readOnly = false;
    @api required = false;
    @api timezone = "";
    @api accessKey;
    @api selectionStart;
    @api selectionEnd;
}