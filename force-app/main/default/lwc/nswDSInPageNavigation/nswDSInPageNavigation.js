import { LightningElement, api, track } from "lwc";
import NswDSMarkdown from "c/nswDSMarkdown";
import { normalizeString } from "c/nswUtilsPrivate";
import { NavigationMixin } from "lightning/navigation";

const i18n = {
    OnThisPage: "On this page"
}

export default class NswDSInPageNavigation extends NavigationMixin(LightningElement) {
    static mdEngine = new NswDSMarkdown();

    // ---- links
    _links;
    @track _linkItems;

    @api get links() {
        return this._links;
    }
    
    set links(markdown) {
        markdown = normalizeString(markdown, { toLowerCase: false });
        this._links = markdown;

        try {
            this._linkItems = NswDSInPageNavigation.mdEngine.extractLinks(markdown);   
        } catch(e) {
            console.log(e);
        }
    }


    @api nswClass;

    get computedDivClass() {
        return "nsw-container" + this.nswClass ? " " + this.nswClass : "";
    }

    get i18n() {
        return i18n;
    }



    handleClick(event) {
        event.preventDefault();
        let href = event.currentTarget.dataset.href;

        this.navigateTo("standard__webPage", {
            url: href
        });
    }

    navigateTo(type, config, state = null) {
        /* standard__recordPage
            {
                recordId: this.contact.data.Id,
                objectApiName: 'Contact',
                actionName: 'view'
            }

            'standard__namedPage'
            attributes: {
                pageName: 'home'
            }

            'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }

            'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },

            'standard__recordRelationshipPage',
            attributes: {
                recordId: this.account.data.Id,
                objectApiName: 'Account',
                relationshipApiName: 'Contacts',
                actionName: 'view'
            }

        */

        this[NavigationMixin.Navigate]({
            type: type,
            attributes: config,
            state: state,
        });
    }

}