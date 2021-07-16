import { LightningElement, api } from "lwc";

export default class NswDSTextAreaComm extends LightningElement {
    @api label="Text Area";
    @api name;
    @api isLegend = false;
    @api helper;
    @api placeholder;
    @api value = "";
    @api required = false;
    @api readOnly = false;
    @api disabled = false;
    @api minLength = 0;
    @api maxLength = 255;
}