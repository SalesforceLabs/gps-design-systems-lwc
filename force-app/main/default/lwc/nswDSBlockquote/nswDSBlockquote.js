import { LightningElement, api } from 'lwc';

export default class NswDSBlockquote extends LightningElement {
    @api quote = "Quote";
    @api author = "Author";
}