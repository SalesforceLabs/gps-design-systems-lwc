//import x from "c/nswFieldUtils";

import Body from "@salesforce/schema/Attachment.Body";

//(function s() {
//        $A.componentService.addModule('markup://lightning:lookupUtils', "lightning/lookupUtils", ["exports", "lwc", "aura-instrumentation", "@salesforce/label/LightningLookup.advancedSearchMobile", "@salesforce/label/LightningLookup.messageWhenBadInputDefault", "@salesforce/label/LightningLookup.recentObject", "@salesforce/label/LightningLookup.searchObjectsPlaceholder", "@salesforce/label/LightningLookup.resultsListHeaderMobile", "@salesforce/label/LightningLookup.typeaheadResultsListHeaderMobile", "@salesforce/label/LightningLookup.searchPlaceholder", "lightning/fieldUtils", "@salesforce/label/LightningLookup.add", "@salesforce/label/LightningLookup.createNewObject", "@salesforce/label/LightningLookup.search", "@salesforce/label/LightningLookup.currentSelection"], function (e, t, r, n, i, a, o, s, l, c, u, f, d, p, _) {
/*            var E = h(n),
                O = h(i),
                g = h(a),
                b = h(o),
                m = h(s),
                A = h(l),
                T = h(c),
                I = h(f),
                N = h(d),
                L = h(p),
                P = h(_);
                */
export const COMMON_LOOKUP_CONSTANTS = {
    ACTION_ADVANCED_SEARCH: "actionAdvancedSearch",
    ARIA_DESCRIBEDBY: "aria-describedby",
    ICON_ADD: "utility:add",
    ICON_CHECK: "utility:check",
    ICON_DEFAULT: "standard:default",
    ICON_SEARCH: "utility:search",
    ICON_SIZE_SMALL: "small",
    ICON_SIZE_X_SMALL: "x-small",
    LIST_SIZE_DEFAULT: 5,
    LIST_SIZE_MOBILE_ADVANCED_SEARCH: 25,
    OPTION_TYPE_CARD: "option-card",
    OPTION_TYPE_INLINE: "option-inline",
    PILL_TYPE_ICON: "icon"
};

export const GET_LOOKUP_RECORDS_WIRE_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 25,
    LAYOUT_TYPE_FULL: "Full",
    MODE_VIEW: "View",
    QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS: "dependentFieldBindings",
    QUERY_PARAMS_PAGE: "page",
    QUERY_PARAMS_PAGE_SIZE: "pageSize",
    QUERY_PARAMS_Q: "q",
    QUERY_PARAMS_SEARCH_TYPE: "searchType",
    QUERY_PARAMS_SOURCE_RECORD_ID: "sourceRecordId",
    SEARCH_TYPE_FULL: "Search",
    SEARCH_TYPE_RECENT: "Recent",
    SEARCH_TYPE_TYPEAHEAD: "TypeAhead"
};

export const GET_RECORD_UI_WIRE_CONSTANTS = {
    HTTP_STATUS_NOT_FOUND: 404
};




const i18n = {
        add: "add", //I.default,
        advancedSearchMobile: "advancedSearchMobile", //E.default,
        createNew: "createView", //N.default,
        fullSearchResultsHeader: "fullSearchResultsHeader", //m.default,
        mruHeader: "mruHeader", //g.default,
        messageWhenBadInputDefault: "messageWhenBadInputDefault", //O.default,
        searchObjectsPlaceholder: "searchObjectsPlaceholder", //b.default,
        searchPlaceholder: "searchPlaceholder", //T.default,
        search: "search", //L.default,
        typeaheadResultsHeader: "typeaheadResultsHeader", //A.default
    };

function computeUnqualifiedFieldApiName(e = "") {
    null === e && (e = "");
    const t = e.indexOf(".");
    return t < 1 ? "" : e.substring(t + 1)
}

function getIconOf(e) {
    if (!e || !e.themeInfo || !e.themeInfo.iconUrl) return COMMON_LOOKUP_CONSTANTS.ICON_DEFAULT;
    const t = e.themeInfo.iconUrl.split("/"),
        r = t.pop().replace(/(_\d+)(\.\w*)/gi, "");
    return `${t.pop()}:${r}`
}

function hasCJK(e = "") {
    if (null === e) return !1;
    if ("string" != typeof e) return !1;
    const t = e.trim().split("");
    for (let e = 0; e < t.length; e++)
        if (/^[\u1100-\u1200\u3040-\uFB00\uFE30-\uFE50\uFF00-\uFFF0]+$/.test(t[e])) return !0;
    return !1
}

function isApiExternal(e) {
    return /__x$/.test(e)
}

function isFullSearch(e) {
    return e === GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_FULL
}

function isUndefined(e) {
    return void 0 === e
}

function isValidTypeAheadTerm(e) {
    if (!e) return !1;
    const t = e.replace(/[()"?*]+/g, "").trim();
    return t.length < 255 && (t.length > 2 || hasCJK(t))
}

function mergeIntervals(e) {
    if (!e || !e.length) return [];
    e.sort((e, t) => e[0] !== t[0] ? e[0] - t[0] : e[1] - t[1]);
    let t = e[0];
    const r = [t],
        n = e.length;
    for (let i = 0; i < n; i++) {
        const n = e[i];
        n[0] <= t[1] ? t[1] = Math.max(t[1], n[1]) : (r.push(n), t = n)
    }
    return r
}

function splitTextFromMatchingIndexes(e, t) {
    const r = [];
    if (!e || !t || 0 === t.length) return r;
    const n = mergeIntervals(t);
    n.sort((e, t) => e[0] > t[0]);
    let i = 0;
    for (let t = 0; t < n.length; t++) {
        const a = n[t][0],
            o = n[t][1],
            s = e.substring(i, a);
        s && r.push({
            text: s
        }), r.push({
            text: e.substring(a, o),
            highlight: !0
        }), i = o
    }
    const a = e.substring(i);
    return a && r.push({
        text: a
    }), r
}


export var LookupUtils = Object.freeze({
    __proto__: null,
    arraysIdentical: function (e = [], t = []) {
        if (!Array.isArray(e) || !Array.isArray(t)) return !1;
        if (e.length !== t.length) return !1;
        const r = Object.assign([], e).sort(),
            n = Object.assign([], t).sort();
        return r.toString() === n.toString()
    },

    computeAdvancedSearchOption: function (isDesktop, searchTerm) {
        const option = {
            iconSize: COMMON_LOOKUP_CONSTANTS.ICON_SIZE_X_SMALL,
            value: COMMON_LOOKUP_CONSTANTS.ACTION_ADVANCED_SEARCH,
            text: i18n.advancedSearchMobile.replace("{0}", searchTerm)
        };

        const additionalOptions = isDesktop ? {
            iconAlternativeText: "" + i18n.search,
            iconName: COMMON_LOOKUP_CONSTANTS.ICON_SEARCH,
            type: COMMON_LOOKUP_CONSTANTS.OPTION_TYPE_CARD
        } : {
            action: true,
            endIconName: COMMON_LOOKUP_CONSTANTS.ICON_SEARCH,
            endIconNameAlternativeText: "" + i18n.search,
            type: COMMON_LOOKUP_CONSTANTS.OPTION_TYPE_INLINE
        };

        return {
            ...option,
            ...additionalOptions
        };
    },

    computeCreateNewOption: function (e = "") {
        return null === e && (e = ""), {
            iconAlternativeText: "" + i18n.add,
            iconName: COMMON_LOOKUP_CONSTANTS.ICON_ADD,
            iconSize: COMMON_LOOKUP_CONSTANTS.ICON_SIZE_X_SMALL,
            text: ("" + i18n.createNew).replace("{0}", e),
            type: COMMON_LOOKUP_CONSTANTS.OPTION_TYPE_CARD,
            value: "actionCreateNew"
        }
    },

    computeHeadingDesktop: function (e, t) {
        return t === GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_RECENT ? ("" + i18n.mruHeader).replace("{0}", e) : ""
    },

    computeHeadingMobile: function (e, t) {
        let r = "";
        switch (t) {
            case GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_RECENT:
                r = ("" + i18n.mruHeader).replace("{0}", "Items");
                break;
            case GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_TYPEAHEAD:
                r = ("" + i18n.typeaheadResultsHeader).replace("{0}", e);
                break;
            case GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_FULL:
                r = ("" + i18n.fullSearchResultsHeader).replace("{0}", e)
        }
        return r
    },

    computeHighlightedItems: function (e, t) {
        const r = [];
        if (!e || 0 === e.length || !t) return r;
        const n = t.trim().split(" ").filter((e, t, r) => r.indexOf(e) === t);
        return e.forEach(e => {
            const t = Object.assign({}, e),
                i = [];
            e.text ? i.push({
                type: "text",
                text: e.text
            }) : t.text = null, e.subText ? i.push({
                type: "subText",
                text: e.subText
            }) : t.subText = null, i.forEach(e => {
                const r = function (e, t) {
                    let r = [];
                    if (!e || !t) return r;
                    const n = {},
                        i = e.toLowerCase();
                    for (let r = 0; r < t.length; r++) {
                        const a = t[r].toLowerCase();
                        let o = 0,
                            s = 0,
                            l = 0;
                        for (; s < e.length && -1 !== o && l < 1;)
                            if (o = i.indexOf(a, s), o > -1) {
                                const e = o + a.length;
                                n[o] ? n[o] < e && (n[o] = e) : n[o] = e, l++, s = e
                            }
                    }
                    return r = Object.keys(n).map(e => [parseInt(e, 10), n[e]]), r
                }(e.text, n);
                0 === r.length ? t[e.type] = [{
                    text: e.text
                }] : t[e.type] = splitTextFromMatchingIndexes(e.text, r)
            }), r.push(t)
        }), r
    },

    computeListSize: function (e, t) {
        return e !== GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_FULL || t ? COMMON_LOOKUP_CONSTANTS.LIST_SIZE_DEFAULT : COMMON_LOOKUP_CONSTANTS.LIST_SIZE_MOBILE_ADVANCED_SEARCH
    },

    computePlaceholder: function (e) {
        let t;
        return t = e ? ("" + i18n.searchObjectsPlaceholder).replace("{0}", e) : "" + i18n.searchPlaceholder, t
    },

    computeRecordPills: function (e, t, r, n) {
        let i = [];
        if (!e || !t || !r) return i;
        const a = isUndefined(e.fields[t.relationshipName]) ? null : e.fields[t.relationshipName].value;
        if (!a) return i;
        const o = a.apiName;
        if (a.fields.Id.value !== e.fields[t.fieldName].value && n !== a.fields.Id.value) return i;
        if (o in r) {
            const n = r[o];
            i = [{
                iconAlternativeText: n.iconAlternativeText,
                iconName: n.iconName,
                iconSize: COMMON_LOOKUP_CONSTANTS.ICON_SIZE_SMALL,
                label: a.fields[n.nameField].value,
                type: COMMON_LOOKUP_CONSTANTS.PILL_TYPE_ICON,
                value: e.fields[t.fieldName].value,
                externalObjectValue: isApiExternal(o) ? a.fields.Id.value : void 0
            }]
        }
        return i
    },

    computeRecordValues: function (e, t) {
        if (!e || !t) return [];
        const r = computeUnqualifiedFieldApiName(t),
            n = e.fields[r];
        return n && n.value ? [n.value] : []
    },

    computeSearchType: function (e) {
        return isFullSearch(e[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_SEARCH_TYPE]) ? GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_FULL : isValidTypeAheadTerm(e[GET_LOOKUP_RECORDS_WIRE_CONSTANTS.QUERY_PARAMS_Q]) ? GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_TYPEAHEAD : GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_RECENT
    },

    computeUnqualifiedFieldApiName: computeUnqualifiedFieldApiName,

    difference: function (e, ...t) {
        return (e || []).filter(e => !t.includes(e.value))
    },

    getIconOf: getIconOf,

    getSearchTypeAndItems: function (e) {
        const t = e.find(e => !!e.items);

        if (t) {
            return {
                searchType: t.searchType,
                items: t.items
            };
        }
        
        return {}
    },

    hasCJK: hasCJK,

    hasCreateFromLookup: function (e) {
        return (e || []).some(e => !!e && "Lookup" === e.actionListContext && "CreateFromLookup" === e.apiName)
    },
    isApiExternal: isApiExternal,

    isFullSearch: isFullSearch,

    isMRU: function (e) {
        return e === GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_RECENT
    },

    isTypeAhead: function (e) {
        return e === GET_LOOKUP_RECORDS_WIRE_CONSTANTS.SEARCH_TYPE_TYPEAHEAD
    },

    isUndefined: isUndefined,

    isValidSearchTerm: function (e) {
        if (!e) return !1;
        const t = e.replace(/[()"?*]+/g, "").trim();
        return t.length >= 2 || hasCJK(t)
    },

    isValidTypeAheadTerm: isValidTypeAheadTerm,

    mapLookupWireRecords: function (e, t, r, n) {
        return e.map(e => {
            const i = e.fields;
            return {
                ...r,
                ...{
                    iconSize: COMMON_LOOKUP_CONSTANTS.ICON_SIZE_SMALL,
                    subText: i.hasOwnProperty("DisambiguationField") ? i.DisambiguationField.value : null,
                    text: i[t].value,
                    type: n,
                    value: isApiExternal(e.apiName) ? i.ExternalId.value : i.Id.value,
                    externalObjectValue: isApiExternal(e.apiName) ? i.Id.value : null
                }
            };
        });
    },

    mapRecordUiWireRecords: function (e, t) {
        return {
            pills: e.filter(e => e.referencedApiNameField).map(e => ({
                iconAlternativeText: e.apiName,
                iconName: getIconOf(t[e.apiName]),
                label: e.fields[e.referencedApiNameField].value,
                type: COMMON_LOOKUP_CONSTANTS.PILL_TYPE_ICON,
                value: isApiExternal(e.apiName) ? e.fields.ExternalId.value : e.id,
                externalObjectValue: isApiExternal(e.apiName) ? e.id : void 0
            })),
            invalidValues: e.filter(e => !e.referencedApiNameField).map(e => e.id)
        }
    },

    mergeIntervals: mergeIntervals,

    parseLdsError: function (e) {
        console.log('+++++parseLdsError', e);
        //const t = parseError(e); TODO
        let t = {
            message: e.body.message,
            detail: e.body.stackTrace
        }
        return t.message || t.detail
    },

    splitTextFromMatchingIndexes: splitTextFromMatchingIndexes
});

function q(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function X(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2 ? q(Object(r), !0).forEach(function (t) {
            $(e, t, r[t])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : q(Object(r)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
        })
    }
    return e
}

function $(e, t, r) {
    return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

const LightningLookup_currentSelection = "current-selection";

export class MetadataManager {
    constructor(fieldName, objectInfos, record, selectedEntityApiName) {
        this.fieldApiName = null;
        this.fieldInfo = null;
        this.fieldLevelHelp = null;
        this.referenceInfos = {};
        this._sourceObjectInfo = {};
        this._targetObjectInfo = {};

        if (fieldName &&
            Object.keys(record || {}).length &&
            Object.keys(objectInfos || {}).length) {
            this._sourceObjectInfo = MetadataManager.computeObjectInfo(objectInfos, record.apiName);
            this.fieldApiName = MetadataManager.computeFieldApiName(fieldName, this._sourceObjectInfo.apiName);
            this.fieldInfo = MetadataManager.computeFieldInfo(objectInfos, this._sourceObjectInfo.apiName, this.fieldApiName);
            this.fieldLevelHelp = this.fieldInfo.inlineHelpText;
            this.referenceInfos = MetadataManager.computeReferenceInfos(objectInfos, this.fieldInfo.references);
            this._targetObjectInfo = MetadataManager.computeObjectInfo(objectInfos, selectedEntityApiName || this.getTargetApiName());
        }
    }

    static computeFieldInfo(e, t, r) {
        let n = {};
        if (!e || !t || !r) return n;
        const i = computeUnqualifiedFieldApiName(r),
            a = e[t] || {},
            o = a.fields ? a.fields[i] : null;
        return o && (n = {
            dependentFields: o.filteredLookupInfo ? o.filteredLookupInfo.controllingFields : void 0,
            fieldName: i,
            inlineHelpText: o.inlineHelpText,
            isRequired: o.required,
            references: o.referenceToInfos,
            relationshipName: o.relationshipName
        }), n
    }

    static computeFieldApiName(e = "", t = "") {
        null === e && (e = ""), null === t && (t = "");
        let r = "";
        if ("string" == typeof e && e.length) {
            e.indexOf(".") >= 1 && (r = e)
        } else "object" == typeof e && "string" == typeof e.objectApiName && "string" == typeof e.fieldApiName && (r = e.objectApiName + "." + e.fieldApiName);
        return !r.length && e.length && t.length && (r = t + "." + e), r
    }

    static computeObjectInfo(e, t) {
        if (!e || !t) return {};
        const r = e[t] || {},
            n = r.themeInfo || {};
        return {
            apiName: t,
            color: n.color || "",
            iconAlternativeText: t,
            iconName: getIconOf(r),
            iconUrl: n.iconUrl || "",
            keyPrefix: r.keyPrefix,
            label: r.label,
            labelPlural: r.labelPlural
        }
    }

    static computeReferenceInfos(e = {}, t = []) {
        null === e && (e = {}), null === t && (t = []);
        const r = {},
            n = t.length;
        for (let i = 0; i < n; i++) {
            const n = t[i],
                a = n.apiName,
                o = n.nameFields;
            let s;
            if (Array.isArray(o) && o.length > 0) {
                s = o.length > 1 ? "Name" : o[0];
                const t = MetadataManager.computeObjectInfo(e, a);
                t.nameField = s, t.optionalNameField = a + "." + s, r[a] = t
            }
        }
        return r
    }

    get dependentFields() {
        return this.fieldInfo.dependentFields
    }

    get isFieldRequired() {
        return this.fieldInfo.isRequired
    }

    get isSingleEntity() {
        return 1 === Object.keys(this.referenceInfos).length
    }

    get optionalNameFields() {
        let e = this.referenceInfos;
        null === e && (e = {});
        const t = [];
        for (const r in e) e.hasOwnProperty(r) && e[r].hasOwnProperty("optionalNameField") && t.push(e[r].optionalNameField);
        return t
    }

    get sourceApiName() {
        return this._sourceObjectInfo.apiName
    }

    get sourceEntityLabel() {
        return this._sourceObjectInfo.label
    }

    get targetApiName() {
        return this._targetObjectInfo.apiName
    }

    get targetLabel() {
        return this._targetObjectInfo.label
    }

    get targetPluralLabel() {
        return this._targetObjectInfo.labelPlural
    }

    _getFieldValue(e, t) {
        const {
            fields: r
        } = e;
        return ["Id", "RecordTypeId"].includes(t) ? e[this._uncapitalize(t)] || null : r && r[t] && void 0 !== r[t].value ? r[t].value : null
    }

    _isEmptyObject(e) {
        if (null == e) return !1;
        for (const t in e) return !1;
        return !0
    }

    _uncapitalize(e) {
        return e.charAt(0).toLowerCase() + e.slice(1)
    }

    getBindingsMap(e) {
        return e && this.dependentFields && this.dependentFields.length ? this.dependentFields.reduce((t, r) => X(X({}, t), {}, {
            [r]: this._getFieldValue(e, r)
        }), {}) : null
    }

    getBindingsString(e) {
        const t = this.getBindingsMap(e);
        return t && Object.entries(t).map(([e, t]) => `${e}=${t}`).join(",")
    }

    getTargetObjectIconDetails() {
        return {
            iconAlternativeText: this._targetObjectInfo.iconAlternativeText,
            iconName: this._targetObjectInfo.iconName
        }
    }

    getTargetObjectAsScope() {
        let e = this._targetObjectInfo || {};
        return {
            iconUrl: e.iconUrl,
            label: e.label,
            labelPlural: e.labelPlural,
            name: e.apiName
        }
    }

    getTargetApiName() {
        if (this.isTargetEntityEmptyOrStale()) {
            const e = this.fieldInfo.references;
            return Array.isArray(e) && e.length ? e[0].apiName : void 0
        }
        return this._targetObjectInfo.apiName
    }

    getEntitiesLabelInfo() {
        return {
            sourceEntityLabel: this.sourceEntityLabel,
            targetEntityLabelPlural: this.targetPluralLabel,
            targetLabel: this.targetLabel
        }
    }

    getReferencedApiNameField(e) {
        return Object.prototype.hasOwnProperty.call(this.referenceInfos, e) && this.referenceInfos[e].nameField
    }

    getReferencedApiNameFieldFromTargetApi() {
        return this.getReferencedApiNameField(this.targetApiName)
    }

    getFilterItems() {
        const e = this.referenceInfos || {},
            t = this.targetApiName,
            r = Object.keys(e);
        let n = null;
        return r.length > 1 && (r.sort(), n = [], r.forEach(r => {
            const i = {
                text: e[r].label,
                type: COMMON_LOOKUP_CONSTANTS.OPTION_TYPE_INLINE,
                value: r
            };
            t && r === t && (i.highlight = !0, i.iconAlternativeText = "" + LightningLookup_currentSelection, i.iconName = COMMON_LOOKUP_CONSTANTS.ICON_CHECK, i.iconSize = COMMON_LOOKUP_CONSTANTS.ICON_SIZE_X_SMALL), n.push(i)
        })), n
    }

    isTargetEntityEmptyOrStale() {
        return this._isEmptyObject(this._targetObjectInfo) || !Object.prototype.hasOwnProperty.call(this.referenceInfos, this._targetObjectInfo.apiName)
    }
}

/*t.registerDecorators(MetadataManager, {
    fields: ["fieldApiName", "fieldInfo", "fieldLevelHelp", "referenceInfos", "_sourceObjectInfo", "_targetObjectInfo"]
}),*/

/*
e.COMMON_LOOKUP_CONSTANTS = S,
e.GET_LOOKUP_RECORDS_WIRE_CONSTANTS = R,
e.GET_RECORD_UI_WIRE_CONSTANTS = C,
e.LOGGING_CONSTANTS = v;
*/


export class LookupEventDispatcher {
    constructor(e) {
        this.dispatchEvent = e.dispatchEvent.bind(e)
    }
    dispatchChangeEvent(e) {
        this.dispatchEvent(function (e) {
            return new CustomEvent("change", {
                bubbles: !0,
                composed: !0,
                detail: {
                    value: e
                }
            })
        }(e))
    }
    dispatchErrorEvent(e) {
        this.dispatchEvent(function (e) {
            return new CustomEvent("error", {
                bubbles: !0,
                composed: !0,
                detail: {
                    error: e
                }
            })
        }(e))
    }
    dispatchCreateEvent(e, t) {
        this.dispatchEvent(function (e, t) {
            return new CustomEvent("createnew", {
                bubbles: !0,
                composed: !0,
                detail: {
                    value: e,
                    callback: t
                }
            })
        }(e, t))
    }
    dispatchEntityFilterSelect(e) {
        this.dispatchEvent(function (e) {
            return new CustomEvent("entityfilterselect", {
                detail: {
                    value: e
                }
            })
        }(e))
    }
    dispatchLookupRecordsRequestEvent(e, t) {
        this.dispatchEvent(function (e, t) {
            return new CustomEvent("lookuprecordsrequest", {
                detail: {
                    requestParams: e,
                    shouldLoadMore: t
                }
            })
        }(e, t))
    }
    dispatchPillRemoveEvent(e) {
        this.dispatchEvent(function (e) {
            return new CustomEvent("pillremove", {
                detail: {
                    removedValue: e
                }
            })
        }(e))
    }
    dispatchRecordItemSelectEvent(e) {
        this.dispatchEvent(function (e) {
            return new CustomEvent("recorditemselect", {
                detail: {
                    selectedValue: e
                }
            })
        }(e))
    }
};



/*
e.LookupPerformanceLogger = D,
e.LookupUtils = z,
e.MetadataManager = ee,
*/
