import { LightningElement, api, track } from 'lwc';
import { 
    MetadataManager, LookupEventDispatcher, LookupUtils,
    COMMON_LOOKUP_CONSTANTS, GET_LOOKUP_RECORDS_WIRE_CONSTANTS
} from 'c/nswLookupUtils';

const i18n = {
    searchPlaceholder: "searchPlaceholder",
    searchObjectsPlaceholder:  "searchObjectsPlaceholder",
    selectEntity: "selectEntity"
}

export default class NswLookupDesktop extends LightningElement {
    @api disabled;
    @api enableCreateNew; // void 0
    @api inputText = "";
    @api label;
    @api maxValues;
    @api required;
    @api variant;

    @track filterItems;
    @track filterLabel;
    @track inputIconName;
    @track inputMaxLength;
    @track inputPill;
    @track internalPills = [];
    @track placeholder = "";
    @track showActivityIndicator;

    _metadataManager;
    _optionalFields;
    _previousQueryTermSent;
    _value;


    constructor() {
        super();
        
        this._metadataManager = new MetadataManager();
        this.inputIconName = "search"; //COMMON_LOOKUP_CONSTANTS.ICON_SEARCH;
        this.inputMaxlength = 255;
        this.filterLabel = i18n.selectEntity;
        this._events = new LookupEventDispatcher(this)
    }


    // ---- errorMessage

    _errorMessage;

    @api get errorMessage() {
        return this._errorMessage
    }

    set errorMessage(e) {
        this._errorMessage = e;
        const t = this._groupedCombobox;
        // t && (t.setCustomValidity(e), t.reportValidity())
        if (t && t.setCustomValidity(e)) {
            t.reportValidity();
        }
    }


    // ---- fieldName

    _fieldName;

    @api get fieldName() {
        return this._fieldName
    }

    set fieldName(e) {
        this._fieldName = e, this.updateState()
    }


    // ---- items

    _items = [];

    @api get items() {
        console.log('> get items');
        let v = this._items;
        console.log('< get items', JSON.stringify(v));
        return v;

    }

    set items(e) {
        console.log('> set items', JSON.stringify(e));

        //let { items: t } = LookupUtils.getSearchTypeAndItems(e);

        if (this.enableCreateNew) { // === !0
            e = [...e, LookupUtils.computeCreateNewOption(this.textInfo.targetLabel)];
        }

        this._items = e;
        this.showActivityIndicator = false; //!1

        console.log('< set items');

    }


    // ---- objectInfos

    _objectInfos;

    @api get objectInfos() {
        return this._objectInfos
    }

    set objectInfos(e) {
        this._objectInfos = e, this.updateState()
    }


    // ---- pills

    _pills = [];

    @api get pills() {
        return this._pills
    }
    
    set pills(e) {
        console.log('set pills', JSON.stringify(e));
        // this._pills = e || [], this._value = this._pills.map(e => e.value), 1 === this.maxValues && this._pills.length ? (this.inputPill = this._pills[0], this.internalPills = []) : (this.internalPills = this._pills, this.inputPill = null), this._pills.length && (this.inputText = "", this.dispatchEvent(new CustomEvent("reportvalidity"))), this.updateFilterItems()
        this._pills = e || [];
        this._value = this._pills.map(e => e.value);

        if (this.maxValues === 1 && this._pills.length) {
            this.inputPill = this._pills[0];
            this.internalPills = [];
        } else {
            this.internalPills = this._pills;
            this.inputPill = null;
        }
    }


    // ---- record

    _record;

    @api get record() {
        return this._record
    }

    set record(e) {
        this._record = e, this.updateState()
    }


    // ---- validity

    _constraint;

    @api get validity() {
        return this._constraint.validity
    }


    // ---- fieldLevelHelp, filterInputText, fieldApiName

    _metadataManager;

    get fieldLevelHelp() {
        return this._metadataManager.fieldLevelHelp
    }

    get filterInputText() {
        return this._metadataManager.targetLabel
    }

    get _fieldApiName() {
        return this._metadataManager.fieldApiName
    }


    // ---- _groupedCombobox

    get _groupedCombobox() {
//        return this.template.querySelector("lightning-grouped-combobox")
        return this.template.querySelector("c-nsw-d-s-base-combobox");
    }

 
    // ---- focus

    @api focus() {
        if (!this._connected) return;

        let e = this._groupedCombobox;
        if (e) {
            e.focus();
        }
    }


    // ---- connected

    _connected = false;

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }


    // ---- createNewCallback

    createNewCallback(e = []) {
        if (Array.isArray(e) && e.length) {
            this.handleRecordOptionSelect(e[0], true);
        }
    }


    // ---- getPlaceholder

    getPlaceholder() {
        return this._metadataManager.isSingleEntity
            ? i18n.searchObjectsPlaceholder.replace("{0}", this._metadataManager.targetPluralLabel)
            : i18n.searchPlaceholder;
    }


    // ---- handleAdvancedSearchAction

    handleAdvancedSearchAction() {
        const e = this._metadataManager.getTargetObjectAsScope(),
            t = LookupUtils.computeUnqualifiedFieldApiName(this._fieldApiName),
            i = true === this.enableCreateNew || "advanced-only" === this.enableCreateNew;
        m({
            additionalFields: [],
            contextId: "",
            dependentFieldBindings: this._metadataManager.getBindingsMap(this._record),
            entities: [e],
            field: t,
            groupId: "LOOKUP",
            label: this.label,
            maxValues: 1,
            placeholder: this.placeholder,
            recordId: this.record ? this.record.id : "",
            saveCallback: e => {
                e && e.length > 0 && (this.handleRecordOptionSelect(e[0]), this.dispatchEvent(new CustomEvent("reportvalidity")))
            },
            scopeMap: e,
            scopeSets: {
                DEFAULT: [e]
            },
            source: this._metadataManager.sourceApiName,
            showCreateNew: i,
            term: this.inputText
        })
    }


    // ---- event management

    handleBlur() {
        this.dispatchEvent(new CustomEvent("reportvalidity"))
    }

    handleCreateNewAction() {
        this._events.dispatchCreateEvent(this._metadataManager.targetApiName, e => this.createNewCallback(e))
    }

    handleDropdownOpen() {
        this.updateTerm(this.inputText)
    }

    handleDropdownOpenRequest() {
        if (this.inputText.length == 0)
            this.updateTerm("");
    }
    
    handleTextInput(e) {
        if (!e.detail || this.inputPill) return;

        const t = e.detail.text || "";

        if (this.inputText.trim() !== t.trim()) {
            this.updateTerm(t);
        } else {
            this.inputText = t
        }
    }

    handlePillRemove(e) {
        if (e && e.detail) {
            const t = (e.detail.item || {}).value;

            if (!t) return;

            this._events.dispatchPillRemoveEvent(t);
            this.updateTerm("");
        }
    }

    handleRecordOptionSelect(e, t = !1) {
        if (e) {
            this._events.dispatchRecordItemSelectEvent(e);
            this.inputText = "";
        }
    }
    
    handleSelect(e) {
        const t = e.detail.value;

        switch (t) {
            case COMMON_LOOKUP_CONSTANTS.ACTION_ADVANCED_SEARCH:
                this.handleAdvancedSearchAction();
                break;

            case "actionCreateNew":
                this.handleCreateNewAction();
                break;

            default:
                this.handleRecordOptionSelect(t)
        }
    }

    handleSelectFilter(e) {
        if (!e.detail) return;

        const t = e.detail.value;

        if (t !== this._metadataManager.targetApiName) {
            this._selectedEntityApiName = t;
            this._events.dispatchEntityFilterSelect(t);
            this.resetSearchTerm();
            this.updateState();
        }
    }

    resetSearchTerm() {
        this._previousQueryTermSent = null;
        this.updateTerm("");
    }

    updateFilterItems() {
        this.filterItems = (1 === this.maxValues && this.inputPill) ?
            null :
            this._metadataManager.getFilterItems();
        this.placeholder = this.getPlaceholder();
    }

    updateState() {
        if (this._fieldName &&
            Object.keys(this._record || {}).length &&
            Object.keys(this._objectInfos || {}).length) {
            this._metadataManager = new MetadataManager(this._fieldName, this._objectInfos, this._record, this._selectedEntityApiName);
            this.updateFilterItems();
        }
    }

    updateTerm(e) {
        this.inputText = e;
        const t = e.trim();

        if (t !== this._previousQueryTermSent) {
            this._previousQueryTermSent = t;
            this._events.dispatchLookupRecordsRequestEvent({
                [ GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_Q ]: t
            });
            this.showActivityIndicator = true; // !0
        }
    }
}


/*
    m(e) {
        n.showCustomOverlay({
            isTransient: !0,
            isScrollable: !1,
            isFullScreen: !0,
            flavor: "large",
            autoFocus: !1,
            title: e.label
        }).then(t => {
            ! function (e, t) {
                if (!e || !t) return;
                (function (e) {
                    return new Promise((t, i) => {
                        r.createComponent("forceSearch:lookupAdvancedFooter", {
                            "aura:id": "lookupAdvancedFooter"
                        }, (a, s, l) => {
                            "SUCCESS" === s ? (e.set("v.footer", a), t()) : i(l)
                        })
                    })
                })(e).then(function (e, t) {
                    t.panel = e;
                    return new Promise((i, a) => {
                        r.createComponent("forceSearch:lookupAdvanced", t, (t, s, l) => {
                            "SUCCESS" === s ? (e.update({
                                body: t
                            }), i()) : a(l)
                        })
                    })
                }(e, t)).catch(e => {
                    throw new Error(e)
                })
            }(t._panelInstance, e)
        });
    }
*/
