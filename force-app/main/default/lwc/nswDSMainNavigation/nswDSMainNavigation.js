import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import isGuest from "@salesforce/user/isGuest";
import cId from "@salesforce/community/Id";
import cBasePath from "@salesforce/community/basePath";
import getNavigationItems from "@salesforce/apex/nswDSNavigation.getNavigationItems";

export default class NswDSMainNavigationBase extends NavigationMixin(LightningElement) {
    @api infobarLabel;
    @api imageSrc;
    @api imageAlt;
    @api navDevName;

    @api homeLabel;
    @api homeIcon;

    get hasHomeLabelOrIcon() {
        return this.homeIcon || this.homeLabel;
    }

    get hasHomeLabelAndIcon() {
        return this.homeIcon && this.homeLabel;
    }

    @track _communityId = cId;
    @track _errorText;
    @track _menuEntries;

    get isPreview() {
        return !document.URL.startsWith(cBasePath);
    }

    @wire(getNavigationItems, { communityId: '$_communityId', devName: '$navDevName' })
    handleWiredItems({ error, data }) {
        if (data) {
            this._errorText = undefined;
            let isP = this.isPreview;
            let index = 1;

            this._menuEntries = data
                .filter(item => item["Status"] === (isP ? "Draft" : "Live") &&
                                ((item["AccessRestriction"] === "None") || !isGuest) &&
                                (item["ParentId"] === undefined))
                .sort((firstEl, secondEl) => firstEl["Position"] - secondEl["Position"])
                .map(item => Object.assign({ index: index++ }, item));
        } else if (error) {
            this._errorText = error.body.message;
        }
    }

    handleClick(event) {
        event.preventDefault();
        let index = parseInt(event.currentTarget.dataset.key);

        if (typeof index != "number" ||
            index < 0 ||
            index > this._menuEntries.length) {
            return;
        }

        if (index == 0) {
            this.navigateTo("standard__webPage", {
                url: cBasePath
            });

            return;
        }

        let entry = this._menuEntries[index - 1];

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

    // ---- mobileMenu

    @track mobileMenuIsOpen = false;

    handleMobileMenuClick() {
        this.mobileMenuIsOpen = !this.mobileMenuIsOpen;

        let element = this.template.querySelector(".nsw-navigation");
        if (element) {
            console.log("found");
            element.classList.toggle("is-open", this.mobileMenuIsOpen);
        }
    }
}