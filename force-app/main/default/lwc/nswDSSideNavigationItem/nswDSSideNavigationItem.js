import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import cBasePath from "@salesforce/community/basePath";

export default class NswDSSideNavigationItem extends NavigationMixin(LightningElement) {
    @api baseUrl;

    get computedItemAClass() {
        return "nsw-sidenav__link" + ((this._item && this._item["isCurrentPage"]) ? " is-current" : "");
    }

    // ---- item

    _item;

    @api get item() {
        return this._item;
    };

    set item(value) {
        this._item = value;
    }


    // ---- level

    @api level;

    get nextLevel() {
        return typeof this.level === 'number' ? this.level + 1 : parseInt(this.level.toString()) + 1;
    }


    // ---- computedUlClass

    get computedUlClass() {
        return `nsw-sidenav__list nsw-sidenav__list--level-${this.nextLevel}`
    }


    // ---- displayItems for children

    get _displayItems() {
        if (!this.item.children) {
            return []
        };

        let itemIndex = 1;

        return this.item.children
        .filter(item => item != null)
        .map((item) => ({
            Id: item.Id,
            Label: item.Label,
            Target: item.Target,
            TargetPrefs: item.TargetPrefs,
            Type: item.Type,
            isCurrentPage: item.isCurrentPage,
            children: item.children,
            keyId: `item-${itemIndex++}`,
        }));
    }



    handleClick(event) {
        event.preventDefault();
        let entry = this.item;

        switch(entry["Type"]) {
            case "Event":
                break;

            case "ExternalLink":
                if (entry["TargetPrefs"] === "OpenExternalLinkInSameTab") {
                    window.open(entry["Target"], "_self");
                } else {
                    this.navigateTo("standard__webPage", {
                        url: entry["Target"]
                    });
                }
                break;

            case "GlobalAction":
                // entry["Target"] is name of Global Action
                break;

            case "InternalLink":
                console.log("** nav to ", cBasePath + entry["Target"]);
                this.navigateTo("standard__webPage", {
                    url: cBasePath + entry["Target"]
                });
                break;

            case "NavigationalTopic":
                break;

            case "SalesforceObject":
                this.navigateTo("standard__objectPage", {
                    objectApiName: entry["Target"],
                    actionName: "list"
                },
                {
                    filterName: entry["DefaultListViewId"]
                });
                break;

            case "SystemLink":
                break;
        }
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

