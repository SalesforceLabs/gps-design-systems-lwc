import { LightningElement, api } from 'lwc';

export default class TestFlow extends LightningElement {
    @api str;
    @api camelStr;
    @api int;
    @api intValue;
    @api dec;
    @api bool;
    @api maxLength;
    @api minlength;
    @api avgLength;
}