import { LightningElement, api } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSCalloutComm extends LightningElement {
    mdEngine = new NswDSMarkdown();
    _content = "";
    _contentHtml = "";

    @api set content(markdown) {
        this._content = markdown;
        try {
            this._contentHtml = this.mdEngine.render(markdown.replaceAll("\\n", "\n"));
        } catch(e) {
            console.log(e);
        }
    }

    get content() {
        return this._content;
    }

    _rendered = false;

    renderedCallback() {
        if (this._rendered == false) {
            let element = this.template.querySelector(".nsw-callout__content");
            if (element) {
                element.innerHTML = this._contentHtml;
                element.querySelectorAll("a").forEach(e => e.classList.add("nsw-text-link"));
            } else {
                console.log("Couldn't find placeholder");
            }
            this._rendered = true;
        }
    }

    @api title;
    @api iconName;
    @api nswClass;
}