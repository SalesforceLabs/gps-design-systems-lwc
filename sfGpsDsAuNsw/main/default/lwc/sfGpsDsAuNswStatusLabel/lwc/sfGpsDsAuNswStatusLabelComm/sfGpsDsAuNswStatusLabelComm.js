import { LightningElement, api } from "lwc";
export default class SfGpsDsAuNswStatusLabelComm extends LightningElement {
    // @ts-ignore
    @api
    label;
    // @ts-ignore
    @api
    status;
    // @ts-ignore
    @api
    className;
    /* lifecycle */
    connectedCallback() {
        this.classList.add("nsw-scope");
    }
}
