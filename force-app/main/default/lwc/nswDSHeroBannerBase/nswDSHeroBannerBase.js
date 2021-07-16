import { LightningElement, api } from "lwc";

export default class NswDSHeroBannerBase extends LightningElement {
    @api titleLink;
    @api titleLabel;
    @api imageSrc;
    @api imageAlt;
    @api nswClass;
}