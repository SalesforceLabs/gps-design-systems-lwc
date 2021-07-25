import { LightningElement, api } from 'lwc';

export default class NswDSProgressIndicator extends LightningElement {
    @api currentStep = 1;
    @api totalSteps = 1;
    @api nswClass;
}