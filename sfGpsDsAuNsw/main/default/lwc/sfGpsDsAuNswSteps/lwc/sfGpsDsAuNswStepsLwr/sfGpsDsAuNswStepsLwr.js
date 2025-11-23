import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
/**
 * @slot Step1
 * @slot Step2
 * @slot Step3
 * @slot Step4
 * @slot Step5
 * @slot Step6
 * @slot Step7
 * @slot Step8
 * @slot Step9
 * @slot Step10
 * @slot Step11
 * @slot Step12
 */
export default class SfGpsDsAuNswStepsLwr extends SfGpsDsLwc {
    // @ts-ignore
    @api
    type;
    // @ts-ignore
    @api
    cstyle;
    // @ts-ignore
    @api
    headingLevel;
    // @ts-ignore
    @api
    item1title;
    // @ts-ignore
    @api
    item2title;
    // @ts-ignore
    @api
    item3title;
    // @ts-ignore
    @api
    item4title;
    // @ts-ignore
    @api
    item5title;
    // @ts-ignore
    @api
    item6title;
    // @ts-ignore
    @api
    item7title;
    ;
    // @ts-ignore
    @api
    item8title;
    // @ts-ignore
    @api
    item9title;
    // @ts-ignore
    @api
    item10title;
    // @ts-ignore
    @api
    item11title;
    // @ts-ignore
    @api
    item12title;
    // @ts-ignore
    @api
    // @ts-ignore
    firstChild;
    // @ts-ignore
    @api
    className;
    /* lifecycle */
    constructor() {
        super(true);
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
