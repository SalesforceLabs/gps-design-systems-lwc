import { LightningElement, api } from 'lwc';

export default class NswDSLegendComm extends LightningElement {
    @api label;
    @api required = false;    
    @api helper;
    @api nswClass;
}