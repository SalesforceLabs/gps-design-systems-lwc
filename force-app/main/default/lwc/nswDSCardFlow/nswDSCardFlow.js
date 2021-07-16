import { LightningElement, api } from "lwc";

export default class NswDSCardFlow extends LightningElement {
    @api titleLink;
    @api isHeadline;
    @api tag;
    @api date;
    @api content;
    @api imageSrc;
    @api imageAlt;
    @api nswClass;
}