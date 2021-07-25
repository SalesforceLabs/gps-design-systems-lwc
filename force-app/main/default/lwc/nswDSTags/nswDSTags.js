import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";

export default class NswDSTags extends LightningElement {
    static mdEngine = new NswDSMarkdown();

    @api nswClass;

    get computedDivClass() {
        return "nsw-tags" + (this.nswClass ? " " + this.nswClass : "");
    }


    // -- links: text in markdown format

    @track _links = [];
    _linksValue;

    @api get links() {
        return this._linksValue;
    }

    set links(markdown) {
        this._linksValue = markdown;

        console.log("set links", markdown);

        try {
           this._links = NswDSTags.mdEngine.extractLinks(markdown); 
        } catch(e) {
            console.log(e);
        }
    }


    // --- labels

    _labels;

    @api get labels() {
        return this._labels;
    }

    set labels(value) {
        this._labels = value;
        console.log("set labels", JSON.stringify(value));
        let index = 1;

        if (Array.isArray(value)) {
            this._links = value.map(item => ({
                text: item,
                index: index++
            }));
        } else {
            this._links = value.toString().split(";").map(item => ({
                text: item,
                index: index++
            }));
        }
    }
}