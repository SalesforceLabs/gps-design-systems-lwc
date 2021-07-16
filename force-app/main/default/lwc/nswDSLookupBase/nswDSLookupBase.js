import { LightningElement, api, track } from 'lwc';
import { toHighlightParts } from './highlight';
import { debounce } from 'c/nswInputUtils';
import { normalizeBoolean, synchronizeAttrs } from 'c/nswUtilsPrivate';
import getSuggestions from "@salesforce/apex/nswDSLookupController.getSuggestions";

const DEBOUNCE_PERIOD = 250;

export default class NswDSLookupBase extends LightningElement {
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

    @track _inputIconName = 'search';
    @track _items;
    @track _showActivityIndicator;
    @track _disabled;

    _labelForId;

    connectedCallback() {
        this._items = [];
        this._debouncedTextInput = debounce((text) => {
            this._requestSuggestions(text);
        }, DEBOUNCE_PERIOD);
    }


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

    @api get error() {
        return this._errorText;
    }

    set error(error) {
        this._errorText = error;
    }
 

    renderedCallback() {
        const label = this.template.querySelector('label');
        if (label) {
            synchronizeAttrs(label, {
                for: this._labelForId,
            });
            label.setAttribute('for', this._labelForId);
        }
    }

    handleComboboxReady(e) {
        this._labelForId = e.detail.id;
    }

    _requestSuggestions(key) {
        console.log('_requestSuggestions ' + key);
        if (key && key.length >= 2) {
            this._showActivityIndicator = true;

            getSuggestions({
                objectApiName: 'Account',
                fieldApiNames: [ this.mainFieldApiName, this.secondaryFieldApiName, this.valueFieldApiName ],
                key: key,
                nRows: this.nRows
            })
            .then(result => {
                this._processAutoComplete(result, key);
            })
            .catch(error => {
                console.log("Error", error);
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
            console.log('handleSelect value='+JSON.stringify(value));
            this.value = value;
            this.dispatchChangeEvent(value);
        }
    }

    _processAutoComplete(suggestions, key) {
        console.log('_processAutoComplete ' + suggestions.length + ' ' + key);
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

                return {
                    type: 'option-card',
                    text: parts,
                    iconName: sin,
                    subText: secondaryText,
                    value: suggestion[vfan],
                };
            })
            .filter(suggestion => suggestion != null);
        }
    }

    dispatchChangeEvent(value) {
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value,
                },
            })
        );
    }

}