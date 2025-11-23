import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const SHOWERRORINDICATOR_DEFAULT = false;
const TABLABEL_DEFAULT = "Tab";
export default class SfGpsDsAuNswtabLwr extends SfGpsDsElement {
    static renderMode = "light";
    // @ts-ignore
    @api
    className;
    // @ts-ignore
    @api
    vid;
    // @ts-ignore
    @api
    variaLabelledBy;
    // @ts-ignore
    @api
    vhidden;
    /* api: value, Any */
    _value;
    _valueOriginal;
    // @ts-ignore
    @api
    get value() {
        return this._valueOriginal;
    }
    set value(value) {
        this._valueOriginal = value;
        this._value = String(value);
        this._dispatchDataChangeEventIfConnected();
    }
    /* api: label, String */
    _label = TABLABEL_DEFAULT;
    // @ts-ignore
    @api
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
        this._dispatchDataChangeEventIfConnected();
    }
    /* api: title, String */
    _title = "";
    // @ts-ignore
    @api
    // @ts-ignore
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
        this._dispatchDataChangeEventIfConnected();
    }
    // @ts-ignore
    @api
    showErrorIndicator;
    _showErrorIndicator = this.defineBooleanProperty("showErrorIndicator", {
        defaultValue: SHOWERRORINDICATOR_DEFAULT,
        watcher: () => { this._dispatchDataChangeEventIfConnected(); }
    });
    /* computed */
    get computedClassName() {
        return {
            "nsw-tabs__content": true,
            [this.className || ""]: this.className
        };
    }
    /* methods */
    _loadContent = false;
    // @ts-ignore
    @api
    loadContent() {
        this._loadContent = true;
        this.dispatchEvent(new CustomEvent("active"));
    }
    _dispatchDataChangeEventIfConnected() {
        if (this._isConnected) {
            this.dispatchEvent(new CustomEvent("privatetabdatachange", {
                cancelable: true,
                bubbles: true,
                composed: true
            }));
        }
    }
    /* lifecycle */
    _deregistrationCallback;
    constructor() {
        super();
        this.handleMounted(() => {
            this.dispatchEvent(new CustomEvent("privatetabregister", {
                cancelable: true,
                bubbles: true,
                composed: true,
                detail: {
                    setDeregistrationCallback: (deregistrationCallback) => {
                        this._deregistrationCallback = deregistrationCallback;
                    }
                }
            }));
        });
        this.handleUnmounted(() => {
            if (this._deregistrationCallback) {
                this._deregistrationCallback();
            }
        });
    }
}
