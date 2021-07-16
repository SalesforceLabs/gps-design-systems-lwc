import { LightningElement, api } from 'lwc';

export default class NswDSCalloutFlow extends LightningElement {
    @api iconName;
    @api title;
    @api content;
    @api nswClass;
}