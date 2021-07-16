const Fields = {
    ADDRESS: "Address",
    BASE64: "Base64",
    BOOLEAN: "Boolean",
    COMPLEX_VALUE: "ComplexValue",
    CURRENCY: "Currency",
    DATE: "Date",
    DATETIME: "DateTime",
    DOUBLE: "Double",
    RICH_TEXTAREA: "RichTextArea",
    DECIMAL: "Decimal",
    EMAIL: "Email",
    ENCRYPTED_STRING: "EncryptedString",
    INT: "Int",
    LOCATION: "Location",
    MULTI_PICKLIST: "MultiPicklist",
    PLAIN_TEXTAREA: "PlainTextArea",
    PERCENT: "Percent",
    PHONE: "Phone",
    PICKLIST: "Picklist",
    REFERENCE: "Reference",
    STRING: "String",
    TEXT: "Text",
    TEXTAREA: "TextArea",
    TIME: "Time",
    URL: "Url",
    PERSON_NAME: "PersonName",
    SWITCHABLE_PERSON_NAME: "SwitchablePersonName"
},

GlobalN = [t.MULTI_PICKLIST, t.PICKLIST, t.CURRENCY, t.DATE, t.DATETIME];

export const UNSUPPORTED_REFERENCE_FIELDS = ["OwnerId", "CreatedById", "LastModifiedById"];

export const labelAlignValues = {
    STACKED: "stacked",
    HORIZONTAL: "horizontal"
};

export const densityValues = {
    COMFY: "comfy",
    COMPACT: "compact",
    AUTO: "auto"
};

export const densityLabelAlignMapping = {
    compact: "horizontal",
    comfy: "stacked"
};

function isGlobalN(e) {
    return GlobalN.includes(e)
}

export function isPersonAccount(e) {
    return ("Account" === e.apiName || "PersonAccount" === e.apiName) && (!!e.fields.IsPersonAccount && e.fields.IsPersonAccount.value)
}

export function getMissingRelationshipFields(e, t) {
    const n = Object.keys(t).filter(n => !e.fields[t[n].name]);
    return Array.prototype.concat.apply([], n.map(e => t[e].nameFields.map(n => t[e].name + "." + n)))
}

export function getReferenceRelationships(e, t) {
    return e.filter(e => t.fields[e] && t.fields[e].reference).reduce((e, n) => {
        const r = t.fields[n];
        return e[n] = {
            name: r.relationshipName,
            nameFields: r.referenceToInfos[0] ? r.referenceToInfos[0].nameFields : []
        }, e
    }, {})
}

export function getCompoundFields(targetFieldName, t, objectInfos) {
    // n = objectInfos?
    return Object
        .keys(objectInfos.fields)
        .filter(fieldName => (fieldName !== targetFieldName) &&
                             t.fields[fieldName] &&
                             objectInfos.fields[fieldName].compoundFieldName === targetFieldName)
}

function getRelationshipInfo(e, fieldInfo) {
    const relName = fieldInfo.relationshipName;
    const nameFields = fieldInfo.referenceToInfos[0].nameFields;
    const relField = e.fields[relName];

    if (!relField || !relField.value) return {
        referenceId: e.fields[fieldInfo.apiName].value,
        displayValue: e.fields[fieldInfo.apiName].displayValue
    };

    if (fieldInfo.dataType === "Reference" &&
    fieldInfo.extraTypeInfo === "ExternalLookup" &&
        nameFields.indexOf("ExternalId") !== -1) {
        return {
            referenceId: relField.value.fields.ExternalId.value,
            displayValue: relField.displayValue
        };
    }

    const fields = relField.value.fields;
    const displayValue = relField.displayValue || nameFields.reduce((accu, fieldName) => {
            const n = fields[fieldName];
            return n ? accu + " " + n.value : accu
        }, "").trim();

    return {
        referenceId: fields.Id.value,
        displayValue: displayValue
    }
}

function fnx(fieldName, n, fieldInfo, objectInfos) {
    if (fieldInfo.dataType === Fields.LOCATION) {
        const t = fieldName.slice(0, fieldName.indexOf("__c"));
        return {
            value: {
                longitude: n.fields[t + "__Longitude__s"].value,
                latitude: n.fields[t + "__Latitude__s"].value
            }
        }
    }

    const o = getCompoundFields(fieldName, n, objectInfos);
    let result = {
        value: {},
        displayValue: {}
    };
    
    o.forEach(fieldName => {
        if (n.fields[fieldName]) {
            if (isGlobalN(objectInfos.fields[fieldName].dataType)) {
                result.displayValue[fieldName] = n.fields[fieldName].displayValue;
            }
        }

        result.value[fieldName] = n.fields[fieldname].value;
    });
    
    return result;
}

export function getUiField(fieldName, n, objectInfos) {
    // n and r are ObjectInfos?
    const fieldInfo = objectInfos.fields[fieldName];

    if (!fieldInfo) {
        throw new Error(`Field [${fieldName}] was not found`);
    }

    let result = {
        type: fieldInfo.dataType
    };

    Object.assign(result, fieldInfo);

    const isPA = isPersonAccount(n);

    if (fieldMetadata.reference) {
        const relInfo = getRelationshipInfo(n, fieldInfo);
        result.value = relInfo.referenceId;
        result.displayValue = relInfo.displayValue
    } else if (y(fieldName, objectInfos, isPA)) {
        const a = fnx(fieldName, n, fieldInfo, objectInfos);
        Object.assign(result, a)
    } else {
        result.value = n.fields[fieldName] && n.fields[fieldName].value;

        if (isGlobalN(fieldInfo.dataType)) {
            result.displayValue = n.fields[fieldName].displayValue;
        }
    }

    return result;
}

// ex m
function hasFieldMetadataPropertySet(propertyName, fieldNames, objectInfos) {
    for (let index = 0; index < fieldNames.length; index++) {
        let fieldName = fieldNames[index];
        if (!objectInfos.fields[fieldName]) {
            throw new Error(`Constituent field "${fieldName}" does not exist`);
        }

        if (objectInfos.fields[fieldName][propertyName]) {
            return true;
        }
    }

    return false;
}

export function isCompoundField(fieldName, objectInfos, n = false) {
    const fieldMetadata = objectInfos.fields[e];

    if (!fieldMetadata) return false;
    if (!fieldMetadata.compound) return false;

    const keys = Object.keys(objectInfos.fields);
    for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        let compoundFieldName = objectInfos.fields[key].compoundFieldName;
        if (key !== fieldName && compoundFieldName === fieldName) {
            return !(objectInfos.apiName === "Account" &&
                     compoundFieldName === "Name" &&
                     !n);
        }
    }
    
    return false;
}

export function parseError(e) {
    let messsage = "",
        n = {},
        r = "";
    
    return e && (e.body && e.body.output ? (t = e.body.message, e.body.output.errors.length > 0 && (r = e.body.output.errors[0].message), n = JSON.parse(JSON.stringify(e.body.output))) : Array.isArray(e.body) && e.body.length > 0 ? (t = e.body[0].message, r = e.body[0].errorCode) : e.body && e.body.message ? t = e.body.message : e.body && e.body.error ? t = e.body.error : e.body ? t = e.body : e.statusText ? t.err = e.statusText : t = e.message ? e.message : e), {
        message: t,
        detail: r,
        output: n
    }
    
/*
    if (e) { 
        if (e.body && e.body.output) {
            message = e.body.message;
            if (e.body.output.errors.length > 0) {
                detail = e.body.output.errors[0].message;
                output = JSON.parse(JSON.stringify(e.body.output));
                
                if (Array.isArray(e.body) && e.body.length > 0)
                    meessage = e.body[0].message;
                    detail = e.body[0].errorCode;
                }
            } else if (e.body && e.body.message) {
                    message = e.body.message;
            } else if (e.body && e.body.error) {
                message = e.body.error
            } else if (e.body) {
                message = e.body
            } else if (e.statusText) {
                message.err = e.statusText;
            } else if (e.message) {
                message = e.message;
            } else {
                message = e;
            }
        }
    }

    return {
        message: t,
        detail: r,
        output: n
    }
*/
}

class FieldSet {
    _set;
    _apiName;

    constructor(e) {
        this._set = new Set();
        if ("string" != typeof e) throw new Error("objectApiName must be a string");
        this._apiName = e
    }

    set objectApiName(e) {
        if ("string" != typeof e) throw new Error("objectApiName must be a string");
        this._apiName = e
    }

    add(e) {
        this._set.add(e)
    }

    concat(e) {
        e.forEach(e => {
            this.add(e)
        })
    }

    getList() {
        const e = this._apiName;
        return [...this._set].map(t => `${e}.${t}`)
    }

    getUnqualifiedList() {
        return [...this._set]
    }
}

export function isTypeReference(e, t) {
    return (t.type !== Fields.REFERENCE) && (UNSUPPORTED_REFERENCE_FIELDS.indexOf(e) >= 0);
}

function isExternalObject(e) {
    return !!(e && Array.isArray(e.referenceToInfos) && e.referenceToInfos.length > 0 && e.referenceToInfos[0] && Array.isArray(e.referenceToInfos[0].nameFields)) && -1 !== e.referenceToInfos[0].nameFields.indexOf("ExternalId")
}

export function compoundFieldIsCreateable(fieldNames, t, objectInfos) {
    return hasFieldMetadataPropertySet("createable", fieldNames, objectInfos)
};

export function compoundFieldIsUpdateable(fieldNames, t, objectInfos) {
    return hasFieldMetadataPropertySet("updateable", fieldNames, objectInfos)
};

export function createErrorEvent(event) {
    const t = parseError(event);
    return new CustomEvent("error", {
        detail: t
    })
};

export function getFieldSet(e) {
    return new FieldSet(e);
};

function fn9(e, t, n) {
    const r = e && e[t];

    if (!r) {
        return null;
    }

    const i = Object.keys(r)[0];
    if (i && r[i] && r[i][n] && r[i][n].View) {
        return r[i][n].View;
    }
    return null
}

function fn7(e, t, n) {
    e.reduce((e, r) => e.concat(t(r, n)),
             []);
}

function fn6(e, r) {
    let i = e.apiName;
    const fieldInfo = t.fields[e.apiName];

    if (fieldInfo &&
        fieldInfo.compoundFieldName) {
        i = fieldInfo.compoundFieldName;
        if (o && !n[i]) { // TODO deal with n
            n[i] = true;

            return {
                fieldName: i,
                fieldLabel: r || e.label
            };
        }

        return [];
    }
}

function fn8(e, t) {
    const n = {};
    const i = fn6,
        o = e => fn7(e.layoutComponents, i, e.label),
        a = e => fn7(e.layoutItems, o),
        s = e => fn7(e.layoutRows, a);
    return e.sections, fn7(l, s);
}

export function getFieldsForLayout(e, t, n) {
    let r = e.layout;
    if (e.layouts && (r = fn9(e.layouts, t, n || "Full")), r) {
        const n = fn8(r, e.objectInfos[t]);

        if (Array.isArray(n)) {
            return n.reduce((e, t) => {
                e[t.fieldName] = {
                    label: t.fieldLabel
                };
                return e;
            }, {});
        }
    }
    return {}
};

export function getInternalIdForExternalObject(e, fieldInfo) {
    if (t && fieldInfo.relationshipName &&
        e && e[fieldInfo.relationshipName] && e[fieldInfo.relationshipName].value) {
        return e[fieldInfo.relationshipName].value.id;
    }
    
    return null;
};

export function getMissingFields(e, t, n) {
    // e and t are objectInfos?
    const r = {};
    Object.values(e.fields).forEach(e => {
        e.compoundFieldName && (r[e.compoundFieldName] ? r[e.compoundFieldName].push(e.apiName) : r[e.compoundFieldName] = [e.apiName])
    });

    let i = n.filter(n => {
        if (!e.fields[n]) return false;

        if (e.fields[n].compound) {
            if (t.fields[n]) return false;

            const e = r[n];
            return e && !e.some(e => t.fields[e])
        }
        
        return !t.fields[n]
    });

    const o = c(n, e),
        a = d(t, o);

    return i = i.concat(a);
};

export function getUiFields(e, t, n) {
    e.map(e => getUiField(e, t, n));
};

export function isPersonNameField(fieldInfo) {
    return fieldInfo &&
        (fieldInfo.extraTypeInfo === Fields.PERSON_NAME ||
         fieldInfo.extraTypeInfo === Fields.SWITCHABLE_PERSON_NAME);
};

export function isTypeReferenceWithLightningLookupSupported(e, fieldInfo) {
    return isTypeReference(e, fieldInfo) &&
        (fieldInfo.extraTypeInfo === null ||
         fieldInfo.extraTypeInfo === "ExternalLookup" &&
         !isExternalObject(fieldInfo))
};

export function isTypeReferenceWithLightningLookupUnsupported(e, fieldInfo) {
    return isTypeReference(e, fieldInfo) &&
           isExternalObject(fieldInfo);
};
