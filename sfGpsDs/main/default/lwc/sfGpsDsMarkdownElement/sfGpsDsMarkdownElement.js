import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsMarkdownElement.html";
export default class sfGpsDsMarkdownElement extends SfGpsDsElement {
    // @ts-ignore
    @api
    className;
    /* api: content */
    _contentOriginal;
    _contentHtml;
    _contentSanitizedHtml;
    // @ts-ignore
    @api
    get content() {
        return this._contentOriginal;
    }
    set content(markdown) {
        this._contentOriginal = markdown;
        this._contentHtml = mdEngine.renderEscaped(this._contentOriginal);
        if (this.sanitizer && typeof this.sanitizer.sanitize === "function") {
            this._contentSanitizedHtml = this.sanitizer.sanitize(this._contentHtml);
        }
        else {
            this._contentSanitizedHtml = this._contentHtml;
        }
    }
    /* computed */
    get sanitizer() {
        return null;
    }
    /* lifecycle */
    render() {
        return tmpl;
    }
    renderedCallback() {
        super.renderedCallback?.();
        if (this._contentSanitizedHtml) {
            replaceInnerHtml(this.refs.markdown, this._contentSanitizedHtml);
        }
    }
}
