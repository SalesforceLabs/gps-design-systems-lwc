import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import isGuest from "@salesforce/user/isGuest";
import cId from "@salesforce/community/Id";
import cBasePath from "@salesforce/community/basePath";
import getNavigationItems from "@salesforce/apex/nswDSNavigation.getNavigationItems";
import getBaseUrl from "@salesforce/apex/nswDSNavigation.getBaseUrl";

export default class NswDSSideNavigation extends NavigationMixin(LightningElement) {
    @api navDevName;
    @api currentPage;

    @track _communityId = cId;
    @track _errorText;
    @track _menuEntries;
    @track _baseUrl;

    get isPreview() {
        let r = !document.URL.startsWith(this._baseUrl);
        console.log('** isPreview', r);
        return r;
    }

    @wire(getBaseUrl, {})
    handleWiredBaseUrl({ error, data }) {
        if (data) {
            this._baseUrl = data;
        } else if (error) {
            console.log('error', JSON.stringify(error));
        }
    }


    get route() {
        let pathElements = document.URL.split(cBasePath);

        if (pathElements.length < 2) {
            return null;
        }

        let index = pathElements[1].indexOf("?");
        return index >= 0 ? pathElements[1].substring(0, index) : pathElements[1];
    }


    @wire(getNavigationItems, { communityId: '$_communityId', devName: '$navDevName' })
    handleWiredItems({ error, data }) {
        if (data) {
            this._errorText = undefined;
            let isP = this.isPreview,
                route = this.route;

            let menuEntries = data
                .filter(item => item["Status"] === (isP ? "Draft" : "Live") &&
                                ((item["AccessRestriction"] === "None") || !isGuest));
                
            const hashTable = {};
            menuEntries.forEach(item => hashTable[item["Id"]] = {
                ...item,
                children: [],
                isCurrentPage: item["Type"] === "InternalLink" &&
                               item["Target"] &&
                               item["Target"] == route,

            });

            const menuTree = [];
            menuEntries.forEach(item => {
                let id = item["Id"],
                    parentId = item["ParentId"],
                    position = item["Position"];

                if (parentId) {
                    hashTable[parentId].children[position] = hashTable[id];
                } else {
                    // At the root level, 0 is Home but not present
                    menuTree[position - 1] = hashTable[id];
                }
            });

            this._menuEntries = menuTree;
        } else if (error) {
            this._errorText = error.body.message;
        }
    }

    get _displayItems() {
        if (!this._menuEntries) {
            return []
        };

        let itemIndex = 1;

        return this._menuEntries
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
}