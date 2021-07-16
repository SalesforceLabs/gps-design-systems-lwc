import { LightningElement, api } from 'lwc';

export default class NswDSContentBlockFlow extends LightningElement {
    @api title;
    @api imageSrc;
    @api imageAlt;
    @api content;
    @api links;
    @api buttonLink;
    @api nswClass;
}