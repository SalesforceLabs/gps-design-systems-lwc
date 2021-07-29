import { LightningElement, api } from 'lwc';
import { normalizeString } from 'c/nswUtilsPrivate';
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSAccordion extends LightningElement {
    static mdEngine = new NswDSMarkdown();

    _content;
    _h1s = []

    @api get content() {
        return this._content;
    }

    set content(markdown) {
        this._content = normalizeString(markdown, { toLowerCase: false });

        try {
            this._h1s = NswDSAccordion.mdEngine.extractH1s(markdown.replaceAll("\\n", "\n"));
            console.log(JSON.stringify(this._h1s));
        } catch(e) {
            console.log('Exception', e);
        }
    }
}