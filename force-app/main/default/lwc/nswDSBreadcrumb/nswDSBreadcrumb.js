import { LightningElement, api, track } from 'lwc';
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from 'c/nswUtilsPrivate';

export default class NswDSBreadcrumb extends LightningElement {
    mdEngine = new NswDSMarkdown();

    @track _items;
    @track _breadcrumbs;

    @api set items(markdown) {
        console.log('bc');
        this._items = normalizeString(markdown, { toLowerCase: false });
        let breadcrumbs = [];

        try {
            let ast = this.mdEngine.parse(markdown),
                walker = ast.walker(),
                event,
                type;

            while ((event = walker.next())) {
                type = event.node.type;
                if (type === "link" && event.entering) {
                    const node = new DOMParser().parseFromString(this.mdEngine.renderNode(event.node), "text/html").body.firstElementChild;
                    breadcrumbs.push({
                        url: node.getAttribute("href"),
                        label: node.textContent,
                        isLast: false
                    });
                }
            }

            // amend the last isLast;
            if (breadcrumbs.length > 0) {
                breadcrumbs[breadcrumbs.length - 1].isLast = true;
            }
            // amend the last isLast;
            if (breadcrumbs.length > 1) {
                breadcrumbs[breadcrumbs.length - 2].isButLast = true;
            }

            this._breadcrumbs = breadcrumbs;
        } catch(e) {
            console.log(e);
        }
    }

    get items() {
        return this._items;
    }

    renderedCallback() {
        console.log('> rendered bc');
        console.log('rendered bc ', this, this.template, this.template.host);
    }
}