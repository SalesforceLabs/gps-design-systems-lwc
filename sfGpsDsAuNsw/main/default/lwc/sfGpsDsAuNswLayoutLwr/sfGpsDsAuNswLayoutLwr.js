import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
/**
 * @slot Main
 * @slot Sidebar
 */
export default class sfGpsDsAuNswLayoutLwr extends SfGpsDsLwc {
    // @ts-ignore
    @api
    mode;
    // @ts-ignore
    @api
    sidebarClassName;
    // @ts-ignore
    @api
    mainClassName;
    // @ts-ignore
    @api
    className;
    /* computed */
    get computedShowSidebarLeft() {
        return this.mode ? this.mode.startsWith("Sidebar Left") : false;
    }
    get computedShowSidebarRight() {
        return this.mode ? this.mode.startsWith("Sidebar Right") : false;
    }
    get computedClassName() {
        return {
            "nsw-layout": true,
            [this.className || ""]: !!this.className
        };
    }
    get computedMainClassName() {
        return {
            "nsw-layout__main": true,
            [this.mainClassName || ""]: !!this.mainClassName
        };
    }
    get computedSidebarClassName() {
        const sidebar = this.mode ? this.mode.startsWith("Sidebar") : false;
        const desktop = this.mode ? this.mode.endsWith("Desktop") : false;
        return {
            "nsw-layout__sidebar": sidebar,
            "nsw-layout__sidebar--desktop": desktop,
            [this.sidebarClassName || ""]: !!this.sidebarClassName
        };
    }
    /* lifecycle */
    constructor() {
        super(true); // isLwrOnly
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("nsw-scope");
    }
}
