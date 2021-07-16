import { LightningElement, api } from 'lwc';

export default class NswDSNotificationFlow extends LightningElement {
    @api type;
    @api title;
    @api content;
    @api nswClass;
}