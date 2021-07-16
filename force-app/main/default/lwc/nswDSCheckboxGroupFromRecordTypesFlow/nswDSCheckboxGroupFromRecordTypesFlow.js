
import { LightningElement, api, track, wire } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class NswDSCheckboxGroupFromRecordTypesFlow extends LightningElement {
    @api label = "Checkbox Group";
    @api helper;
    @api name;
    @api isLegend = false;

    @track error;

    // ---- options
    @api objectApiName;

    @track _options = [];
    _optionsValue;

    @wire(getObjectInfo, { objectApiName: "$objectApiName" }) setOptions({ error, data }) {
        if (error) {
            this.error = "Cannot retrieve object info"
        } else if (data) {
            let index = 1;
            let options = [];
            for (const rtId in data.recordTypeInfos) {
                let rt = data.recordTypeInfos[rtId];
                if (rt.available) {
                    options.push({
                        label: rt.name,
                        value: rt.recordTypeId,
                        id: `checkbox-${index++}`,
                        isChecked: this._value.indexOf(rt.recordTypeId) !== -1
                    });
                }
            }
            this._options = options;
        }
    };

    
    // ---- value
    @track _value = [];
    _valueValue = "";

    @api get value() {
        return this._valueValue;
    }

    set value(v) {
        this._valueValue = v;

        let items = v ? v.toString().trim() : "";
        this._value = items == "" ? [] : items.split(";");
    }


    @api disabled = false;
    @api required = false;


    handleChange(event) {
        if (event.detail.hasOwnProperty("value")) {
            this._value = event.detail.value;
            this._valueValue = this._value;
            const attributeChangeEvent = new FlowAttributeChangeEvent("value", this.value);
            this.dispatchEvent(attributeChangeEvent);    
        }
    }
}