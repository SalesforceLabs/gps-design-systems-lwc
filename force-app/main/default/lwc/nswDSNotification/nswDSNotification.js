import { LightningElement, api } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSNotification extends LightningElement {
    mdEngine = new NswDSMarkdown();

    @api type = "info";
    @api title;

    // ---- content: string in markdown format
    _content = "";
    _contentHtml = "";

    @api set content(markdown) {
        this._content = markdown;
        try {
            this._contentHtml = this.mdEngine.renderEscaped(markdown);
        } catch(e) {
            console.log(e);
        }
    }

    get content() {
        return this._content;
    }

    @api nswClass;


    // ---- 

    _rendered = false;

    renderedCallback() {
        if (this._rendered == false) {
            let element = this.template.querySelector(".nsw-notification__content");
            if (element) {
                element.innerHTML = this._contentHtml;
                element.querySelectorAll("a").forEach(e => e.classList.add("nsw-text-link"));
            }
            this._rendered = true;
        }
    }
}