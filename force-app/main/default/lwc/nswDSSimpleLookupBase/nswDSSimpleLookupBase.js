import { LightningElement, api, track } from "lwc";
import { toHighlightParts } from "./highlight";
import { debounce } from "c/nswInputUtils";
import { normalizeBoolean, synchronizeAttrs } from 'c/nswUtilsPrivate';
import getSuggestions from "@salesforce/apex/nswDSLookupController.getSuggestions";

const DEBOUNCE_PERIOD = 250;

const i18n = {
    DefaultWireErrorMessage: "Error while performing lookup",
}

export default class NswDSSimpleLookupBase extends LightningElement {
    @api inputText = "";
    @api placeholder;

    @api sldsIconName;
    @api objectApiName;
    @api mainFieldApiName;
    @api secondaryFieldApiName;
    @api valueFieldApiName;
    @api nRows = 256;

    @api label;
    @api helper;
    @api isLegend = false;
    @api value;

    @api messageWhenValueMissing;

    @track _inputIconName = "search";
    @track _items;
    @track _showActivityIndicator;
    @track _disabled;

    @track _inputPill;
    _labelForId;


    // ---- connected

    connectedCallback() {
        this._items = [];
        this._debouncedTextInput = debounce((text) => {
            this._requestSuggestions(text);
        }, DEBOUNCE_PERIOD);
    }


    // ---- disabled

    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);

        if (this._disabled && this._dropdownVisible) {
            this.closeDropdown();
        }
    }


    // ---- required

    @track _required = false;

    @api get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }


    // ---- errorText

    _errorText; // "Please select at least one option";

    get error() {
        return this._errorText;
    }

    set error(error) {
        this._errorText = error;
    }
 

    renderedCallback() {
        const label = this.template.querySelector("label");
        if (label) {
            synchronizeAttrs(label, {
                for: this._labelForId,
            });
            label.setAttribute("for", this._labelForId);
        }
    }

    handleComboboxReady(e) {
        this._labelForId = e.detail.id;
    }

    _requestSuggestions(key) {
        if (key && key.length >= 2) {
            this._showActivityIndicator = true;

            getSuggestions({
                objectApiName: this.objectApiName,
                fieldApiNames: [ this.mainFieldApiName, this.secondaryFieldApiName, this.valueFieldApiName ],
                key: key,
                nRows: this.nRows
            })
            .then(result => {
                this.error = undefined;
                this._processAutoComplete(result, key);
            })
            .catch(error => {
                this._showActivityIndicator = false;
                this.error = error.body ? error.body.message : i18n.DefaultWireErrorMessage;
                console.log("Error", JSON.stringify(error));
            });
        } else {
            this._items = [];
        }
    }

    handleTextInput(evt) {
        this.inputText = evt.detail.text;
        this._debouncedTextInput(evt.detail.text);
    }

    handleSelect(evt) {
        const { value } = evt.detail;

        if (value) {
            // Extract value from JSON string
            let objValue = JSON.parse(value);
            this.value = objValue[this.valueFieldApiName];
            this.dispatchChangeEvent(this.value);

            // Add a pill
            this._inputPill = {
                label: objValue[this.mainFieldApiName],
                iconName: this.sldsIconName,
                iconAlternativeText: this.sldsIconName,
                value: objValue[this.valueFieldApiName]
            }
        }
    }

    handlePillRemove(evt) {
        this._inputPill = undefined;
    }

    _processAutoComplete(suggestions, key) {
        this._showActivityIndicator = false;
        this._items = [];

        if (suggestions && key) {
            const mfan = this.mainFieldApiName;
            const sfan = this.secondaryFieldApiName;
            const vfan = this.valueFieldApiName;
            const sin = this.sldsIconName;

            this._items = suggestions
            .map((suggestion) => {
                const mainText = suggestion[mfan];
                const secondaryText = suggestion[sfan];
                const matchedSubstrings = [];

                let index = mainText.indexOf(key);
                if (index < 0) {
                    // we'll filter this out if the main field does not contain the key
                    return null;
                }

                matchedSubstrings.push({offset: index, length: key.length});
                const parts = toHighlightParts(mainText, matchedSubstrings);

                let v = {
                    type: 'option-card',
                    text: parts,
                    iconName: sin,
                    subText: secondaryText,
                    value: JSON.stringify(suggestion)
                };

                return v;
            })
            .filter(suggestion => suggestion != null);
        }
    }


    // ---- validity

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled && this.required && this._inputPill === undefined,
            });
        }

        return this._constraintApi;
    }

    @api get validity() {
        return this._constraint.validity;
    }

    @api checkValidity() {
        return this._constraint.checkValidity();
    }

    @api reportValidity() {
        return this._constraint.reportValidity((message) => {
            this._errorText = message;
        });
    }

    @api setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    @api showHelpMessageIfInvalid() {
        this.reportValidity();
    }


    // ---- Event Management

    dispatchChangeEvent(value) {
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value,
                },
            })
        );
    }


    /**
     * For flow
     * @returns flow validation status
     */

    _flowErrorText = "";

    reportValidityFlow() {
        return this._constraint.reportValidity((message) => {
            this._flowErrorText = message;
        });
    }

    @api validate() {
        if (this.reportValidityFlow()) {
            return {
                isValid: true
            }
        } else {
            return {
                isValid: false,
                errorMessage: this._flowErrorText
            }
        }
    }
}