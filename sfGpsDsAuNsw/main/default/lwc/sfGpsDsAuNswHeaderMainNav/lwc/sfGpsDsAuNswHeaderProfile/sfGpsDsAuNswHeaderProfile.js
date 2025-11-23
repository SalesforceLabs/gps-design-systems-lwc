import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import OnClickOutside from "c/sfGpsDsOnClickOutside";
export default class SfGpsDsAuNswHeaderProfile extends SfGpsDsElement {
    // @ts-ignore
    @api
    signInLabel = "Log in";
    // @ts-ignore
    @api
    isGuest;
    // @ts-ignore
    @api
    userAlias;
    // @ts-ignore
    @api
    navItems;
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @track
    _isOpen = false;
    /* event management */
    // eslint-disable-next-line no-unused-vars
    handleOpenProfile(_event) {
        this._isOpen = true;
    }
    // eslint-disable-next-line no-unused-vars
    handleCloseProfile(_event) {
        this._isOpen = false;
    }
    // eslint-disable-next-line no-unused-vars
    handleLogin(_event) {
        this.dispatchEvent(new CustomEvent("login"));
    }
    handleClickNavigate(event) {
        event.preventDefault();
        const index = event.currentTarget.dataset.ndx;
        this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
    }
    ignore(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    /* lifecycle */
    _onClickOutside;
    constructor() {
        super();
        this.handleMounted(() => {
            if (!this._onClickOutside) {
                this._onClickOutside = new OnClickOutside();
                this._onClickOutside.bind(this, "containerRef", () => {
                    this._isOpen = false;
                });
            }
        });
        this.handleUnmounted(() => {
            if (this._onClickOutside) {
                this._onClickOutside.unbind(this, "containerRef");
                this._onClickOutside = undefined;
            }
        });
    }
}
