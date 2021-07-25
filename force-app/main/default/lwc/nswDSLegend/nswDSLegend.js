import { LightningElement, api } from 'lwc';

export default class NswDSLegend extends LightningElement {
    @api label;
    @api required = false;    
    @api helper;
    @api nswClass;
}