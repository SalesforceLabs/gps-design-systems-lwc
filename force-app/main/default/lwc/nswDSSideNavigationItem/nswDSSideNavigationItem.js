import { LightningElement, api } from "lwc";

export default class NswDSSideNavigationItem extends LightningElement {
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

}

