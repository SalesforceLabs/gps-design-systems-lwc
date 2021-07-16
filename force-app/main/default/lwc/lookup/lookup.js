import { LightningElement, api, track, wire } from "lwc";
import formFactor from "@salesforce/client/formFactor"
import { FieldConstraintApi } from "c/nswInputUtils";
import {
    COMMON_LOOKUP_CONSTANTS,
    GET_LOOKUP_RECORDS_WIRE_CONSTANTS,
    GET_RECORD_UI_WIRE_CONSTANTS,
    LookupUtils,
    MetadataManager
} from "c/nswLookupUtils"; 
import { normalizeRecordId } from "c/nswRecordUtils";
//import { getLookupActions } from "lightning/uiActionsApi";
//import { getLookupRecords } from "lightning/uiLookupsApi";
import getLookupRecords from "@salesforce/apex/nswDSLookupController.getLookupRecords";
import { getRecordUi } from "lightning/uiRecordApi";
import { normalizeBoolean, normalizeString } from "c/nswUtilsPrivate";
import { LookupEventDispatcher } from "c/nswLookupUtils";

const i18n = {
    messageWhenBadInputDefault: "messageWhenBadInputDefault",
    none: "none",
};

export default class Lookup extends LightningElement {
    @api label = i18n.none;
    @api maxValues = 1;
    @api messageWhenValueMissing;

    _actionObjectApiNames;
    _apiNamesWithCreateNewEnabled = [];
    _externalObjectValue;
    _fieldApiName;
    _fieldName;
    _getLookupActionsInProgress;
    _isCreateNewEnabled = false;
    _isDesktop;
    _initProps = false;
    _label = i18n.none;
    _lookupElement;
    _metadataManager;
    _messageWhenBadInput;
    _objectInfos;
    _optionalFields;
    _record;
    _recordIds;
    _required = false;
    _selectedEntityApiName;
    _showAdvancedSearch = true;
    _showCreateNew = false;
    _targetApiName;
    _wireItems = [];
    _requestParams;

    @track fieldLevelHelp;
    @track filterItems;
    @track internalPills = [];
    @track internalValue;
    @track items = [];
    @track textInfo;

    _events;
    _metadataManager;

    constructor() {
        super();

        this._metadataManager = new MetadataManager();
        this._events = new LookupEventDispatcher(this);

        this._requestParams = {
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_Q]: "",
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_SEARCH_TYPE]: GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_RECENT,
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_PAGE]:GET_LOOKUP_RECORDS_WIRE_CONSTANTS.DEFAULT_PAGE,
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_PAGE_SIZE]: GET_LOOKUP_RECORDS_WIRE_CONSTANTS.DEFAULT_PAGE_SIZE,
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS]: null
        };

    }


    // ---- constraint

    _constraint;

    @api checkValidity() {
        return this._constraint.checkValidity()
    }

    @api reportValidity() {
        const e = this._lookupElement;
        return !!e && this._constraint.reportValidity(t => {
            e.errorMessage = t
        })
    }
    
    @api setCustomValidity(e) {
        this._constraint.setCustomValidity(e);

        if (this._lookupElement) {
            this._lookupElement.errorMessage = e;
        }
    }

    @api showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    get validity() {
        return this._constraint.validity;
    }

    get _constraint() {
        return this._constraintApi || (this._constraintApi = new FieldConstraintApi(() => this, {
            valueMissing: () => this._required && (!Array.isArray(this.internalValue) || !this.internalValue.length),
            badInput: () => !(!this._lookupElement || !this._lookupElement.inputText) && !!this._lookupElement.inputText.trim().length
        })), this._constraintApi
    }


    // ---- disabled

    _disabled = false;

    @api get disabled() {
        return this._disabled;
    }

    set disabled(e) {
        this._disabled = normalizeBoolean(e);
    }


    // ---- externalObjectValue

    _externalObjectValue;

    @api get externalObjectValue() {
        return this._externalObjectValue;
    }

    set externalObjectValue(e) {
        this._externalObjectValue = e;
        this.updatePills([], false);
    }


    // ---- fieldName

    _fieldName;

    @api get fieldName() {
        return this._fieldName
    }

    set fieldName(e) {
        this._fieldName = e;
        this.updateMetadata()
    }


    // ---- messageWhenBadInput

    _messageWhenBadInput;

    @api get messageWhenBadInput() {
        return this._messageWhenBadInput || i18n.messageWhenBadInputDefault
    }

    set messageWhenBadInput(e) {
        this._messageWhenBadInput = e
    }


    // ---- objectInfos

    _objectInfos

    @api get objectInfos() {
        return this._objectInfos
    }

    set objectInfos(e) {
        this._objectInfos = e;
        this.updateMetadata()
    }


    // ---- record

    _record;

    @api get record() {
        return this._record;
    }

    set record(e) {
        this._record = e;
        this.updateMetadata()
    }


    // ---- required

    _required;

    @api get required() {
        return this._required;
    }

    set required(e) {
        this._required = normalizeBoolean(e);
        this.updateMetadata()
    }


    // ---- showAdvancedSearch

    _showAdvancedSearch;

    @api get showAdvancedSearch() {
        return this._showAdvancedSearch;
    }

    set showAdvancedSearch(e) {
        this._showAdvancedSearch = e;
        this.updateMetadata()
    }


    // ---- showCreateNew

    _showCreateNew;

    @api get showCreateNew() {
        return this._showCreateNew
    }

    set showCreateNew(e) {
        this._showCreateNew = (typeof e == "string")
            ? normalizeString(e)
            : normalizeBoolean(e);

        if (!e) {
            this._isCreateNewEnabled = false;
        }
    }


    // ---- internalValue
    _internalValue;

    @api get value() {
        return this.internalValue
    }

    set value(e) {
        if (!LookupUtils.arraysIdentical(this.internalValue, e)) {
            this.updateValue(e, false);
            this.updatePills([], false);
        }
    }


    // ---- other

    get _dependentFieldBindings() {
        return this._requestParams[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS]
    }


    // ---- isDesktop

    _isDesktop = (formFactor === "Large");

    get isDesktop() {
        return this._isDesktop
    }


    // ---- misc

    get _isSingleValue() {
        return this.maxValues === 1;
    }

    get _isMRU() {
        return this._searchType === GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_RECENT;
    }

    get lookupElement() {
        if (this._connected && this._lookupElement) {
            return this._lookupElement;
        }

        return null;
    }

    get _searchTerm() {
        return this._requestParams[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_Q]
    }

    get _searchType() {
        return this._requestParams[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_SEARCH_TYPE]
    }


    // ---- methods

    @api focus() {
        if (this._connected && this._lookupElement) {
            this._lookupElement.focus();
        }
    }


    // ---- connected

    _connected = false;
    _initProps = false;

    connectedCallback() {
        this._connected = true;
        this.classList.add("slds-form-element");
    }

    disconnectedCallback() {
        this._connected = false;
        this._initProps = false;
        this._lookupElement = null;
    }


    // ---- rendering

    renderedCallback() {
        if (!this._lookupElement) {
            const e = this._isDesktop ? "lightning-lookup-desktop" : "lightning-lookup-mobile";
            this._lookupElement = this.template.querySelector(e)
        }

        this._initProps || (this.updateMetadata(), this._initProps = true)
    }

    getDisplayItems(e, t) {
        let i = LookupUtils
            .difference(e, ...this.internalValue || [])
            .slice(0, LookupUtils.computeListSize(this._searchType, this.isDesktop));

        if (this._searchTerm.length > 0) {
            i = LookupUtils.computeHighlightedItems(i, this._searchTerm)
        };
        
        i = [{
            label: this._computeLabel(i),
            items: i,
            searchType: this._searchType,
            serverHasMoreRecordsToLoad: t
        }];
        
        this.setAdvancedSearchOption(i);
        
        return i;
    }


    // ---- event management

    handleEntityFilterSelect(e) {
        if (e && e.detail) {
            this._selectedEntityApiName = e.detail.value;
        }

        this.updateMetadata();
    }

    handleReportValidity() {
        this.reportValidity()
    }

    handleLookupRecordsRequest(e) {
        console.log('handleLookupRecordsRequest');
        const t = e.detail.requestParams;
        let i, s, a, r;

        if (e.detail.shouldLoadMore) {
            a = this._requestParams[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_PAGE] += 1
        } else {
            i = t[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_Q];
            s = t[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_SEARCH_TYPE] || LookupUtils.computeSearchType(t);
        }

        r = LookupUtils.isUndefined(i) ? this._searchTerm : i;

        let additionalParams = {
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_PAGE]: a || GET_LOOKUP_RECORDS_WIRE_CONSTANTS.DEFAULT_PAGE,
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_Q]: r,
            [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_SEARCH_TYPE]: s || this._searchType
        };

        this._requestParams = {
            ...this._requestParams,
            ...additionalParams
        };

        this._updateGetLookupRecordsWireConfig();

        if (this.showCreateNew) {
            this._getLookupActionsInProgress = true;
            this._actionObjectApiNames = Object.keys(this._metadataManager.referenceInfos);
        }
    }

    handlePillRemove(e) {
        if (!e || !e.detail) {
            return;
        }

        const t = e.detail.removedValue;

        if (this._isSingleValue) {
            this.updateValue([]);
            this.updatePills([]);
        } else if (t && this.internalValue && this.internalPills) {
            const e = this.internalValue.filter(e => e !== t),
                  i = this.internalPills.filter(e => e.value !== t);
            this.updateValue(e);
            this.updatePills(i)
        }
    }

    handleRecordItemSelect(e) {
        if (!e || !e.detail) {
            return;
        }
        console.log('handleRecordItemSelect');

        if (Array.isArray(this.internalValue) &&
            this.internalValue.length === this.maxValues) {
            return;
        }

        const t = this._createPillForSelectedValue(e.detail.selectedValue);
        let i;

        if (this._isPillAbsentFromCurrentSelection(t)) {
            if (this._isSingleValue) {
                this.updateValue([t.value]);
                 i = [];
                this._externalObjectValue = t.externalObjectValue;
            } else {
                const e = [...this.internalValue || [], t.value];
                this.updateValue(e), i = [...this.internalPills]
            }

            this._isPillResolved(t) && i.push(t), this.updatePills(i)
        }

        this.reportValidity()
    }


    isCreateNewEnabled() {
        const e = this._metadataManager.targetApiName;
        return !!this._apiNamesWithCreateNewEnabled.includes(e) && this.showCreateNew
    }

    setAdvancedSearchOption(e) {
        if (this.showAdvancedSearch &&
            LookupUtils.isValidSearchTerm(this._searchTerm) &&
            !LookupUtils.isFullSearch(this._searchType)) {
            e.unshift(LookupUtils.computeAdvancedSearchOption(this.isDesktop, this._searchTerm));
        }
    }

    updateMetadata() {
        console.log("updatingMetadata", this._fieldName, this._objectInfos);
        if (this._fieldName &&
            Object.keys(this._record || {}).length &&
            Object.keys(this._objectInfos || {}).length) {
                this._metadataManager = new MetadataManager(this._fieldName, this._objectInfos, this._record, this._selectedEntityApiName);
                this.filterItems = [this._metadataManager.getTargetObjectIconDetails()];
                this.textInfo = this._metadataManager.getEntitiesLabelInfo();
            if (this.internalValue == null) {
                const e = LookupUtils.computeRecordValues(this._record, this._metadataManager.fieldApiName);
                this.updateValue(e, false), this.updatePills([])
            }
            this.fieldLevelHelp = this._metadataManager.fieldLevelHelp, this._required = this._metadataManager.isFieldRequired || this._required, this._updateDependentFieldBindings(), this._requestParams[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_SOURCE_RECORD_ID] = this._record && this._record.id
        }
    }

    updatePills(e = []) {
        console.log('update pills', JSON.stringify(e));
        const t = e.map(e => e.value);

        let identical = LookupUtils.arraysIdentical(t, this.internalValue);
        console.log('t=' + JSON.stringify(t));
        console.log('internalValue=', JSON.stringify(this.internalValue));
        console.log('identical1='+identical);
        if (!identical) {
            try {
                const t = LookupUtils.computeRecordValues(this._record, this._metadataManager.fieldApiName);

                if (LookupUtils.arraysIdentical(t, this.internalValue)) {
                    if ((e = LookupUtils.computeRecordPills(this._record, this._metadataManager.fieldInfo, this._metadataManager.referenceInfos, this._externalObjectValue)).length) {
                        identical = true;
                    }
                }
            } catch (e) {
                this._events.dispatchErrorEvent(e)
            }
        }

        console.log('identical2='+identical);
        console.log('internalValue='+this.internalValue);

        if (identical) {
            if (e && e.length) {
                this.internalPills = this._isSingleValue ? e.splice(0, 1) : e;
                console.log('set internalPills to ' + JSON.stringify(this.internalPills));
            } else {
                this.internalPills = [];
            }
        } else if (!identical && this.internalValue.length) {
            if (LookupUtils.isApiExternal(this._metadataManager.targetApiName)) {
                if (this._externalObjectValue) {
                    this._optionalFields = [
                        ...this._metadataManager.optionalNameFields,
                        this._metadataManager.targetApiName + ".ExternalId"
                    ];
                    this._recordIds = [this._externalObjectValue];
                }
            } else {
                this._optionalFields = this._metadataManager.optionalNameFields;
                this._recordIds = this.internalValue.slice();
            }
        }
    }

    updateValue(e = [], t = true) {
        null === e && (e = []), Array.isArray(e) && (e = (e || []).filter(e => e).map(e => normalizeRecordId(e.trim())).filter((e, t, i) => t === i.indexOf(e)), LookupUtils.arraysIdentical(e, this.internalValue) || (e.length > this.maxValues && (e = e.slice(0, this.maxValues)), this.internalValue = e, this._lookupElement && (this._lookupElement.inputText = ""), t && this._events.dispatchChangeEvent(this.internalValue), this.internalValue.length || (this._externalObjectValue = void 0)))
    }

    _computeLabel(e) {
        return e.length === 0 ? "" : this.isDesktop ? LookupUtils.computeHeadingDesktop(this._metadataManager.targetPluralLabel, this._searchType) : LookupUtils.computeHeadingMobile(this._searchTerm, this._searchType)
    }

    _createGenericPill(e, t) {
        const i = {
            id: e,
            label: t
        };
        return this._createPillForSelectedValue(i)
    }

    _createPillForSelectedValue(e) {
        return "string" == typeof e ? this._createPillFromWireItems(e) : "object" == typeof e ? this._createPillFromSelectedValue(e) : void 0
    }

    _createPillFromSelectedValue(e) {
        const t = e.allFields && LookupUtils.isApiExternal(e.allFields.sobjectType);

        let addi = {
            iconSize: COMMON_LOOKUP_CONSTANTS.ICON_SIZE_SMALL,
            label: e.Name || e.label,
            type: COMMON_LOOKUP_CONSTANTS.PILL_TYPE_ICON,
            value: t ? e.allFields.ExternalId : e.id,
            externalObjectValue: t ? e.id : void 0
        };

        return {
            ...this._metadataManager.getTargetObjectIconDetails(),
            ...addi
        };
    }

    _createPillFromWireItems(e) {
        const t = this._wireItems.find(t => t.value === e);
        return t ? {
            iconAlternativeText: t.iconAlternativeText,
            iconName: t.iconName,
            iconSize: t.iconSize,
            label: t.text,
            type: COMMON_LOOKUP_CONSTANTS.PILL_TYPE_ICON,
            value: t.value,
            externalObjectValue: t.externalObjectValue
        } : {
            value: e
        }
    }

    _isPillAbsentFromCurrentSelection(e) {
        return !Array.isArray(this.internalValue) || !this.internalValue.includes(e.value)
    }

    _isPillResolved(e) {
        return e && e.label && e.iconName
    }

    _updateDependentFieldBindings() {
        const e = this._metadataManager.getBindingsString(this._record);
        if (this._dependentFieldBindings !== e) {
            this._requestParams = {
                ...this._requestParams,
                ...{
                    [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS]: e
                    }
            };
        }
    }

    _updateGetLookupRecordsWireConfig() {
        this._fieldApiName = this._metadataManager.fieldApiName;
        this._targetApiName = this._metadataManager.targetApiName;

        console.log(this._fieldApiName, this._targetApiName, this._requestParams);
    }


    @wire(getLookupRecords, {
        fieldApiName: '$_fieldApiName',
        requestParams: '$_requestParams',
        targetApiName: '$_targetApiName',
    }) wiredLookupRecords({ error, data }) {
        console.log('wiredLookupRecords', JSON.stringify(error), JSON.stringify(data));
        if (error) {
            this.items = [];
            throw new Error(LookupUtils.parseLdsError(error));
        }

        if (!data) {
            return;
        }

        const i = data.records || [];
        this._wireItems = LookupUtils
            .mapLookupWireRecords(i,
                                  this._metadataManager.getReferencedApiNameFieldFromTargetApi(),
                                  this._metadataManager.getTargetObjectIconDetails(),
                                  COMMON_LOOKUP_CONSTANTS.OPTION_TYPE_CARD);
        const s = !!data.nextPageUrl;
        if (this._getLookupActionsInProgress) {
            let e = 0;
            const t = () => {
                if (this._getLookupActionsInProgress && e < 100) { 
                    e++;
                    setTimeout(t, 100);
                } else {
                    this.items = this.getDisplayItems(this._wireItems, s);
                }
            };

            setTimeout(t, 100);
        } else {
            this.items = this.getDisplayItems(this._wireItems, s);
        }
    }


    @wire(getRecordUi, {
        layoutTypes: [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.LAYOUT_TYPE_FULL],
        modes: [GET_LOOKUP_RECORDS_WIRE_CONSTANTS.MODE_VIEW],
        optionalFields: '$_optionalFields',
        recordIds: '$_recordIds'
    }) wiredRecordUi({ error, data }) {
        console.log('wiredRecordUi', JSON.stringify(error), JSON.stringify(data));
        if (error && error.status === GET_RECORD_UI_WIRE_CONSTANTS.HTTP_STATUS_NOT_FOUND) {
            const e = this._createGenericPill(this._recordIds[0], f.default);
            return void this.updatePills([e])
        }

        if (error) {
            throw new ErrorLookupUtils.parseLdsError(e);
        }

        if (!data || !data.records) {
            return;
        }

        const i = Object.values(data.records).map(e => {
            return {
                ...e,
                ...{
                    referencedApiNameField: this._metadataManager.getReferencedApiNameField(e.apiName)
                }
            }
        }),
        {
            pills: s,
            invalidValues: a
        } = LookupUtils.mapRecordUiWireRecords(i, this._objectInfos);

        if (a.length > 0 && this.internalValue) {
            const e = this.internalValue.filter(e => !a.includes(e));
            this.updateValue(e, false)
        }

        this.updatePills(s);
    }
}
