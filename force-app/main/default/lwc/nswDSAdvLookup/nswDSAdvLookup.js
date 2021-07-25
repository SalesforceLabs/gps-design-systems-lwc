import { LightningElement, api, track, wire } from 'lwc';
import { getRecordCreateDefaults, getRecord } from 'lightning/uiRecordApi';
import { deepCopy } from 'c/nswUtilsPrivate';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
//import { parseError } from 'c/nswFieldUtils';
import basePath from "@salesforce/community/basePath";
import isGuest from "@salesforce/user/isGuest";


const i18n = {
    InvalidFieldApiNameErrorMsg: "Invalid Field API Name",
    InvalidObjectApiNameErrorMsg: "Invalid Object API Name",
    UnexpectedErrorMsg: "Unexpected Error",
    requiredErrorMessage: "Required"
};


export default class NswDSAdvLookup extends LightningElement {
    @api objectApiName;
    @api fieldApiName;
    @api recordId;
    @api label = "";
    @api required = false;

    @track objectInfos = {};
    @track sourceRecord;

    maxValues = 1;
    _fieldInfo = {}
    _nameField = "";
    _fields;

    // ---- recordId: String

    @track _recordId;

    get recordId() {
        return this._recordId
    }

    set recordId(e) {
        this._recordId = e;
        if (!this._recordId) {
            this._recordName = "";
            this.fireFlowAttributeChangeEvent("recordName", this.recordName);
        }
    }

    //
    get basepath() {
        return basePath;
    }

    get isguest() {
        return isGuest;
    }

    // ---- recordName

    _recordName;

    get recordName() {
        return this._recordName
    }
    set recordName(e) {
        this._recordName = e
    }


    // ---- validate

    @api validate() {
        const e = this.getLookupElement(),
            r = e.validity.valueMissing ? i18n.requiredErrorMessage : "";
        return {
            isValid: e.checkValidity(),
            errorMessage: r
        }
    }


    // ---- wires

    @wire(getRecordCreateDefaults, { objectApiName: '$objectApiName'})
    wiredLookupMetadata({
        error: e,
        data: r
    }) {
        console.log('grcd', e, r);
        if (e) {
            this.showErrorMessage(e);
        } else if (r && r.objectInfos) {
            this.objectInfos = deepCopy(r.objectInfos);
            this._fieldInfo = this.objectInfos[this.objectApiName].fields[this.fieldApiName];

            if (!this._fieldInfo) {
                this.showErrorMessage();
                return; 
            }

            const {
                referenceToInfos: e
            } = this._fieldInfo;

            if (Array.isArray(e) && e.length) {
                const {
                    nameFields: r,
                    apiName: t
                } = e[0];
                this._nameField = r.length > 1 ? "Name" : r[0];
                this._fields = [`${t}.${this._nameField}`]
            }

            this.createSourceRecord();
            this._fieldInfo.required = this.required;
        }
    };


    @wire(getRecord, { recordId: '$_recordId', fields: '$_fields'})
    wiredRecord({
        error: e,
        data: r
    }) {
        console.log('getRecord', e, r);
        if (e) {
            this.showErrorMessage(e)
        } else if (r && typeof r == "object" && Object.keys(r).length > 0) {
            const e = r.fields[this._nameField].value;
            this.fireFlowAttributeChangeEvent("recordName", e);
        }
    };


    // ---- event management

    handleValueChange(e) {
        e.stopPropagation();

        this.fireFlowAttributeChangeEvent("recordId", e.detail.value[0] || "");
    }

    handleError(e) {
        e.stopPropagation(), this.showErrorMessage(e.error)
    }


    // ---- misc

    createSourceRecord() {
        const relName = this._fieldInfo.relationshipName;
        this.sourceRecord = {
            apiName: this.objectApiName,
            fields: {
                [this.fieldApiName]: {
                    value: this.recordId
                },
                [relName]: ""
            }
        }
    }

    showErrorMessage(e) {
        const r = this.getLookupElement();
        // TODO
        //r.setCustomValidity(this._retrieveErrorMessage(e)), r.reportValidity()
    }

    _retrieveErrorMessage(e) {
        //const r = parseError(e); // TODO
        const r = {
            message: ""
        };
        let t = r.message || i18n.UnexpectedErrorMsg;

        if (r && r.detail === "INSUFFICIENT_ACCESS") {
            t = i18n.InvalidObjectApiNameErrorMsg;
        } else if (!this._fieldInfo) {
            t = i18n.InvalidFieldApiNameErrorMsg;
        }
         
        return t;
    }

    getLookupElement() {
        return this.template.querySelector("c-nsw-lookup");
    }

    fireFlowAttributeChangeEvent(e, r) {
        this.dispatchEvent(new FlowAttributeChangeEvent(e, r))
    }
}