import { LightningElement, api } from 'lwc';

export default class NswDSLegendFlow extends LightningElement {
    @api label;
    @api required = false;    
    @api helper;
    @api nswClass;
}