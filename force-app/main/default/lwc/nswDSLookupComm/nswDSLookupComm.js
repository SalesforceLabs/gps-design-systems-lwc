import { LightningElement, api } from 'lwc';

export default class NswDSLookupComm extends LightningElement {
    @api label;
    @api inputText = "";
    @api placeholder;
    @api disabled = false;

    @api sldsIconName;
    @api objectApiName;
    @api mainFieldApiName;
    @api secondaryFieldApiName;
    @api valueFieldApiName;
    @api nRows = 256;
}