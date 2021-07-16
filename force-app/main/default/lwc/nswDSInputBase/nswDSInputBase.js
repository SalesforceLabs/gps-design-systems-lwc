/*
import labelA11yTriggerText from '@salesforce/label/LightningColorPicker.a11yTriggerText';
import labelInputFileBodyText from '@salesforce/label/LightningInputFile.bodyText';
import labelInputFileButtonLabel from '@salesforce/label/LightningInputFile.buttonLabel';
import labelMessageToggleActive from '@salesforce/label/LightningControl.activeCapitalized';
import labelMessageToggleInactive from '@salesforce/label/LightningControl.inactiveCapitalized';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelClearInput from '@salesforce/label/LightningControl.clear';
import labelLoadingIndicator from '@salesforce/label/LightningControl.loading';
import labelNumberIncrementCounter from '@salesforce/label/LightningInputNumber.incrementCounter';
import labelNumberDecrementCounter from '@salesforce/label/LightningInputNumber.decrementCounter';
*/

import { LightningElement, api, track } from 'lwc';
import userTimeZone from '@salesforce/i18n/timeZone';
import formFactor from '@salesforce/client/formFactor';
import { assert, ContentMutation, getRealDOMId, isSafari, isNotUndefinedOrNull,
    isUndefinedOrNull, normalizeAriaAttribute, normalizeBoolean, normalizeKeyValue,
    normalizeString, synchronizeAttrs, decorateInputForDragon, setDecoratedDragonInputValueWithoutEvent } from "c/nswUtilsPrivate"
import { InteractingState, FieldConstraintApiWithProxyInput, generateUniqueId } from "c/nswInputUtils"
import { normalizeInput } from './normalize';
import {
    normalizeDate,
    normalizeDateTimeToUTC,
    normalizeTime,
    normalizeUTCDateTime,
} from './dateTimeUtil';
import {
    calculateFractionDigitsFromStep,
    formatNumber,
    fromIsoDecimal,
    hasValidNumberShortcut,
    hasValidNumberSymbol,
    increaseNumberByStep,
    isValidNumber,
    isValidNumberCharacter,
    normalizeNumber,
    toIsoDecimal,
} from './numberUtil';
import { isValidEmail, isValidMultipleEmails } from './emailUtil';
import { InputSelectionCache } from './selection';
import {
    isBefore,
    isAfter,
} from 'c/nswInternationalizationLibrary';

/*
const ARIA_CONTROLS = 'aria-controls';
const ARIA_LABEL = 'aria-label';
const ARIA_LABELEDBY = 'aria-labelledby';
const ARIA_DESCRIBEDBY = 'aria-describedby';
*/

const VALID_NUMBER_FORMATTERS = [
    'decimal',
    'percent',
    'percent-fixed',
    'currency',
];
const DEFAULT_COLOR = '#000000';
const DEFAULT_FORMATTER = VALID_NUMBER_FORMATTERS[0];

export default class NswDSInputBase extends LightningElement {
    static delegatesFocus = true;

    @api label="Input";
    @api name = generateUniqueId();
    @api helper;
    @api isLegend = false;
    @api placeholder;

    @api messageWhenBadInput; // = 'Bad input';
    @api messageWhenPatternMismatch; // = 'Value does not match expected pattern';
    @api messageWhenRangeOverflow; // = 'Value is too low';
    @api messageWhenRangeUnderflow; // = 'Value is too high';
    @api messageWhenStepMismatch; // = 'Value is not in the right precision';
    @api messageWhenTooShort; // = 'Value is too short';
    @api messageWhenTooLong; // = 'Value is too long';
    @api messageWhenTypeMismatch; // = 'Value type is not as expected';
    @api messageWhenValueMissing; // = 'Value is required';

    @api messageToggleActive; // TODO = i18n.messageToggleActive;
    @api messageToggleInactive; // TODO = i18n.messageToggleInactive;

    //@api ariaLabel;
    @api autocomplete;

    @api dateStyle = "medium";
    @api timeStyle;
    //@api dateAriaLabel;

    /*
    @track _timeAriaDescribedBy;
    @track _timeAriaLabelledBy;
    @track _timeAriaControls;
    @track _dateAriaControls;
    @track _dateAriaDescribedBy;
    @track _dateAriaLabelledBy;
    */
    @track _value;
    @track _type = "text";
    @track _pattern;
    @track _max;
    @track _min;
    @track _step;
    @track _disabled = false;
    @track _readOnly = false;
    @track _required = false;
    @track _checked = false;
    @track _isLoading = false;
    @track _multiple = false;
    @track _timezone = false;
    @track _helpMessage = null;
    @track _isColorPickerPanelOpen = false;
    @track _fieldLevelHelp;
    @track _accesskey;
    @track _maxLength;
    @track _minLength;
    @track _accept;
    @track _variant;
    @track _numberRawValue = '';

    _formatter = DEFAULT_FORMATTER;
    _showRawNumber = false;
    _initialValueSet = false;
    _files = null;
    _rendered;
    _selectionCache;
    isConnected = false;

    constructor() {
        super();

        console.log('constructor, ', this, this.template, this.template.host);
        //this.ariaObserver = new ContentMutation(this);

        // Native Shadow Root will return [native code].
        // Our synthetic method will return the function source.
        this.isNative = this.template.querySelector.toString().match(/\[native code\]/);

        // The selection cache allows us an input to remember what text was selected
        // in cases where we change the text on blur or in browsers (Safari) that
        // don't track it properly.
        this._selectionCache = new InputSelectionCache();
    }


    // -- isConnected
    isConnected = false;

    connectedCallback() {
        // Manually track connected state because this.template.isConnected can be false
        // when input is created using createElement and inserted into dom manually.
        // i.e. create an input element and pass it to showCustomOverlay
        // Remove this state and the one in ContentMutation once the issue is fixed.
        // PR: https://github.com/salesforce/lwc/pull/1798
        this.isConnected = true;

        this._validateRequiredAttributes();

        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.reportValidity());

        if (this.isTypeNumber) {
            this._updateNumberValue(this._value);
        }
    }

    disconnectedCallback() {
        this.isConnected = false;

        this._rendered = false;
        this._initialValueSet = false;
        this._cachedInputElement = undefined;
    }


    // ---- isRendered
    _rendered = false;
    _initialValueSet = false;
    _cachedInputElement;

    renderedCallback() {
        // For W-7962838: In Safari, focus doesn't scroll input into view.
        // Attach the event listener used to cache the selected text when selection changes.
        if (isSafari) {
            this._inputElement.addEventListener(
                'select',
                this.handleSelect.bind(this)
            );
        }

        if (!this._initialValueSet && this._inputElement) {
            this._rendered = true;

            if (this.isTypeNumber) {
                this._numberRawValue = fromIsoDecimal(this._value);
            }

            this._setInputValue(this._displayedValue);
            if (this.isTypeCheckable) {
                this._inputElement.checked = this._checked;
            }
            this._initialValueSet = true;
        }

        console.log('*** prearia sync');
        //this.ariaObserver.sync();
        console.log('*** presyncA11y');
        //this._synchronizeA11y();
        console.log('< rendered');

    }


    /**
     * Reserved for internal use.
     * @type {number}
     *
     */
    @api get formatFractionDigits() {
        return this._formatFractionDigits;
    }
    
    set formatFractionDigits(value) {
        this._formatFractionDigits = value;
        if (this._rendered && this.isTypeNumber) {
            this._setInputValue(this._displayedValue);
        }
    }

    
    /**
     * A space-separated list of element IDs whose presence or content is controlled by the
     * time input when type='datetime'. On mobile devices, this is merged with aria-controls
     * and date-aria-controls to describe the native date time input.
     * @type {string}
     */

    /*
    @api
    get timeAriaControls() {
        return this._timeAriaControls;
    }

    set timeAriaControls(references) {
        this._timeAriaControls = references;
        this.ariaObserver.connectLiveIdRef(references, (reference) => {
            this._timeAriaControls = reference;
        });
    }
*/

    /**
     * A space-separated list of element IDs that provide labels for the date input when type='datetime'.
     * On mobile devices, this is merged with aria-labelled-by and time-aria-labelled-by to describe
     * the native date time input.
     * @type {string}
     */
/*    
    @api
    get dateAriaLabelledBy() {
        return this._dateAriaLabelledBy;
    }

    set dateAriaLabelledBy(references) {
        this._dateAriaLabelledBy = references;
        this.ariaObserver.connectLiveIdRef(references, (reference) => {
            this._dateAriaLabelledBy = reference;
        });
    }
*/    

    /**
     * A space-separated list of element IDs that provide labels for the time input when type='datetime'.
     * On mobile devices, this is merged with aria-labelled-by and date-aria-labelled-by to describe
     * the native date time input.
     * @type {string}
     *
     */
/*    
    @api
    get timeAriaLabelledBy() {
        return this._timeAriaLabelledBy;
    }
 
    set timeAriaLabelledBy(references) {
        this._timeAriaLabelledBy = references;
        this.ariaObserver.connectLiveIdRef(references, (reference) => {
            this._timeAriaLabelledBy = reference;
        });
    }
*/

    /**
     * A space-separated list of element IDs that provide descriptive labels for the time input when
     * type='datetime'. On mobile devices, this is merged with aria-described-by and date-aria-described-by
     * to describe the native date time input.
     *  @type {string}
     *
     */
/*    
    @api
    get timeAriaDescribedBy() {
        return this._timeAriaDescribedBy;
    }
 
    set timeAriaDescribedBy(references) {
        this._timeAriaDescribedBy = references;
        this.ariaObserver.connectLiveIdRef(references, (reference) => {
            this._timeAriaDescribedBy = reference;
        });
    }
*/

    /**
     * A space-separated list of element IDs that provide descriptive labels for the date input when
     * type='datetime'. On mobile devices, this is merged with aria-described-by and time-aria-described-by
     * to describe the native date time input.
     * @type {string}
     */
/*    
    @api
    get dateAriaDescribedBy() {
        return this._dateAriaDescribedBy;
    }
 
    set dateAriaDescribedBy(references) {
        this._dateAriaDescribedBy = references;
        this.ariaObserver.connectLiveIdRef(references, (reference) => {
            this._dateAriaDescribedBy = reference;
        });
    }
*/

    /**
     * A space-separated list of element IDs whose presence or content is controlled by the input.
     * @type {string}
     */
/*    
    @api
    get ariaControls() {
        return this._ariaControls;
    }

    set ariaControls(references) {
        this._ariaControls = references;
        this.ariaObserver.link(
            'input',
            'aria-controls',
            references,
            '[data-aria]'
        );
    }
*/ 

    /**
     * A space-separated list of element IDs that provide labels for the input.
     * @type {string}
     */
/*    
    @api
    get ariaLabelledBy() {
        if (this.isNative) {
            if (!this.template.querySelector('input')) {
                return null
            }; // ESC
            // native version returns the auto linked value
            const ariaValues = this.template
                .querySelector('input')
                .getAttribute('aria-labelledby');
            return filterNonAutoLink(ariaValues);
        }
        return this._ariaLabelledBy;
    }

    set ariaLabelledBy(references) {
        this._ariaLabelledBy = references;
        this.ariaObserver.link(
            'input',
            'aria-labelledby',
            references,
            '[data-aria]'
        );
    }
*/

    /**
     * A space-separated list of element IDs that provide descriptive labels for the input.
     * @type {string}
     */
/*    
    @api
    get ariaDescribedBy() {
        if (this.isNative) {
            if (!this.template.querySelector('input')) {
                return null
            }; // ESC
            // in native case return the linked value
            const ariaValues = this.template
                .querySelector('input')
                .getAttribute('aria-describedby');
            return filterNonAutoLink(ariaValues);
        }
        return this._ariaDescribedBy;
    }

    set ariaDescribedBy(references) {
        this._ariaDescribedBy = references;
        this.ariaObserver.link(
            'input',
            'aria-describedby',
            references,
            '[data-aria]'
        );
    }
*/

    /**
     * String value with the formatter to be used for number input. Valid values include
     * decimal, percent, percent-fixed, and currency.
     * @type {string}
     */
    
    @api
    get formatter() {
        return this._formatter;
    }

    set formatter(value) {
        this._formatter = normalizeString(value, {
            fallbackValue: DEFAULT_FORMATTER,
            validValues: VALID_NUMBER_FORMATTERS,
        });
        this._updateInputDisplayValueIfTypeNumber();
    }


    /**
     * The type of the input. Valid values are checkbox, checkbox-button,
     * color, date, datetime, time, email, file, password, range, search,
     * tel, url, number, and toggle. This value defaults to text.
     * @type {string}
     * @default text
     */

    @api
    get type() {
        return this._type;
    }

    set type(value) {
        console.log('> set type');

        const normalizedValue = normalizeString(value);
        this._type = (normalizedValue === 'datetime') ? 'datetime-local' : normalizedValue;

        console.log('*** prevalidate');

        this._validateType(normalizedValue);

        console.log('*** postvalidate');

        this._inputElementRefreshNeeded = true;

        if (this._rendered) {
            // The type is being changed after render, which means the input element may be different (eg. changing
            // from text to 'checkbox', so we need to set the initial value again
            this._initialValueSet = false;

            if (this.isTypeNumber) {
                // If the type has changed, we need to re-parse the value as a number
                this._updateNumberValue(this._value);
            }
        }

        console.log('*** preproxy');

        this._updateProxyInputAttributes([
            'type',
            'value',
            'max',
            'min',
            'required',
            'pattern',
        ]);

        console.log('< set type');
    }


    /**
     * For the search type only. If present, a spinner is displayed to indicate that data is loading.
     * @type {boolean}
     * @default false
     */
    @api
    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = normalizeBoolean(value);
    }


    /**
     * Specifies the regular expression that the input's value is checked against.
     * This attribute is supported for email, password, search, tel, text, and url types.
     * @type {string}
     *
     */
    
    @api
    get pattern() {
        if (this.isTypeColor) {
            return '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
        }
        return this._pattern;
    }

    set pattern(value) {
        this._pattern = value;
        this._updateProxyInputAttributes('pattern');
    }



    /**
     * The maximum number of characters allowed in the field.
     * Use this attribute with email, password, search, tel, text, and url input types only.
     * @type {number}
     */
    
    @api
    get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        this._maxLength = value;
        this._updateProxyInputAttributes('maxlength');
    }


    /**
     * The minimum number of characters allowed in the field.
     * Use this attribute with email, password, search, tel, text, and url input types only.
     * @type {number}
     */
    
    @api
    get minLength() {
        return this._minLength;
    }

    set minLength(value) {
        this._minLength = value;
        this._updateProxyInputAttributes('minlength');
    }


    /**
     * Specifies the types of files that the server accepts. Use this attribute with file input type only.
     * @type {string}
     */
    
    @api
    get accept() {
        return this._accept;
    }

    set accept(value) {
        this._accept = value;
        this._updateProxyInputAttributes('accept');
    }


    // ---- number and date/time
    /**
     * The maximum acceptable value for the input.  Use this attribute with number,
     * range, date, time, and datetime input types only. For number and range type, the max value is a
     * decimal number. For the date, time, and datetime types, the max value must use a valid string for the type.
     * @type {decimal|string}
     */
    
    @api
    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value;
        this._updateProxyInputAttributes('max');
    }

    get normalizedMax() {
        return this._normalizeDateTimeString(this.max);
    }

    /**
     * The minimum acceptable value for the input. Use this attribute with number,
     * range, date, time, and datetime input types only. For number and range types, the min value
     * is a decimal number. For the date, time, and datetime types, the min value must use a valid string for the type.
     * @type {decimal|string}
     */
    
    @api
    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
        this._updateProxyInputAttributes('min');
    }

    get normalizedMin() {
        return this._normalizeDateTimeString(this.min);
    }


    /**
     * Granularity of the value, specified as a positive floating point number.
     * Use this attribute with number and range input types only.
     * Use 'any' when granularity is not a concern. This value defaults to 1.
     * @type {decimal|string}
     * @default 1
     */

    @api
    get step() {
        // This should be reconsidered as it in effect disabled any step support for datetime/time types on mobile
        if (this.isTypeDateTime || this.isTypeTime) {
            return 'any';
        }
        // It should probably default to '1' instead, but this means that we'd be explicitly passing step='1' to the
        // native input
        return this._step;
    }

    set step(value) {
        console.log('> set step');

        if (typeof value === 'string' && value.toLowerCase() === 'any') {
            this._step = 'any';
        } else {
            this._step =
                isUndefinedOrNull(value) || isNaN(value)
                    ? undefined
                    : String(value);
        }

        this._updateProxyInputAttributes('step');
        this._updateInputDisplayValueIfTypeNumber();

        console.log('< set step');
    }


    // ---- checkbox

    /**
     * If present, the checkbox is selected.
     * @type {boolean}
     * @default false
     */
    
    @api
    get checked() {
        // checkable inputs can be part of a named group, in that case there won't be a change event thrown and so
        // the internal tracking _checked would be out of sync with the actual input value.
        if (this.isTypeCheckable && this._initialValueSet) {
            return this._inputElement.checked;
        }
        return this._checked;
    }

    set checked(value) {
        this._checked = normalizeBoolean(value);

        if (this._rendered) {
            this._inputElement.checked = this._checked;
        }

        // Update proxy input should be set after _inputElement is updated.
        // because when update proxy input, it will use this.checked.
        // if not update this._inputElement, will lead to inconsistent state.
        this._updateProxyInputAttributes('checked');
    }


    // ---- file and email
    /**
     * Specifies that a user can enter more than one value. Use this attribute with file and email input types only.
     * @type {boolean}
     * @default false
     */
    @api
    
    get multiple() {
        return this._multiple;
    }

    set multiple(value) {
        this._multiple = normalizeBoolean(value);
        this._updateProxyInputAttributes('multiple');
    }


    // ---- all
    /**
     * Specifies the value of an input element.
     * @type {object}
     */
    
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        console.log('> set value');
        const previousValue = this._value;

        this._value = normalizeInput(value);

        if (this._rendered && this.isTypeNumber) {
            this._value = normalizeNumber(value);
            // the extra check for whether the value has changed is done for cases
            // when the same value is set back in a change handler, this is to avoid
            // the raw number from changing formatting under the user
            // (eg. if the user typed 1,000 we want to preserve that formatting as the user
            // types the value)
            if (this.validity.badInput || this._value !== previousValue) {
                this._updateNumberValue(value);
            }
        }

        this._updateProxyInputAttributes('value');
        // Setting value of a type='file' isn't allowed
        if (!this.isTypeFile) {
            // Again, due to the interop layer we need to check whether the value being set
            // is different, otherwise we're duplicating the sets on the input, which result
            // in different bugs like Japanese IME duplication of characters in Safari (likely a browser bug) or
            // character position re-set in IE11.
            if (
                this._rendered &&
                this._inputElement.value !== this._displayedValue
            ) {
                this._setInputValue(this._displayedValue);
            }
        }

        console.log('> set value');

    }

    /**
     * If present, the input field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */

    
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        this._updateProxyInputAttributes('disabled');
    }
 

    /**
     * If present, the input field is read-only and cannot be edited by users.
     * @type {boolean}
     * @default false
     */
    
    @api
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
        this._updateProxyInputAttributes('readonly');
    }

    /**
     * If present, the input field must be filled out before the form is submitted.
     * @type {boolean}
     * @default false
     */
    
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes('required');
    }

    get _ignoreRequired() {
        // If uploading via the drop zone or via the input directly, we should
        // ignore the required flag as a file has been uploaded
        return (
            this.isTypeFile &&
            this._required &&
            (this.fileUploadedViaDroppableZone ||
                (this._files && this._files.length > 0))
        );
    }

    // ---- datetime
    /**
     * Specifies the time zone used when type='datetime' only. This value defaults to the user's Salesforce time zone setting.
     * @type {string}
     *
     */
    
    @api
    get timezone() {
        return this._timezone || userTimeZone;
    }

    set timezone(value) {
        this._timezone = value;
        // mobile date/time normalization of value/max/min depends on timezone, so we need to update here as well
        this._updateProxyInputAttributes(['value', 'max', 'min']);
    }

    
    // ---- all
    /**
     * Specifies a shortcut key to activate or focus an element.
     * @type {string}
     *
     */
    
    @api
    get accessKey() {
        return this._accesskey;
    }

    set accessKey(newValue) {
        this._accesskey = newValue;
    }
    


    // ---- file
    /**
     * A FileList that contains selected files. Use this attribute with the file input type only.
     * @type {object}
     *
     */
    
    @api
    get files() {
        if (this.isTypeFile) {
            return this._files;
        }
        return null;
    }


    // ---- all
    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */
    
    @api
    get validity() {
        return this._constraint.validity;
    }


    /**
     * Checks if the input is valid.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Sets a custom error message to be displayed when a form is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */
    
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    
    @api
    reportValidity() {
        return this._constraint.reportValidity((message) => {
            if (this._rendered && !this.isNativeInput) {
                console.log('TODO reportValidation showHelpMessage');
                // TODO this._inputElement.showHelpMessage(message);
            } else {
                this._helpMessage = message;
            }
        });
    }


    /**
     * Displays error messages on invalid fields.
     * An invalid field fails at least one constraint validation and returns false when checkValidity() is called.
     */
    
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }
 

    /**
     * Specifies the index of the first character to select in the input element.
     * This attribute is supported only for text type.
     * Use with selection-end to programmatically set or read the position of
     * selected text.
     */
    
    @api
    get selectionStart() {
        if (this._inputElement && 'selectionStart' in this._inputElement) {
            return this._inputElement.selectionStart;
        }
        return undefined;
    }

    set selectionStart(index) {
        if (this._inputElement && 'selectionStart' in this._inputElement) {
            this._inputElement.selectionStart = index;
        }
    }
    

    /**
     * Specifies the index of the last character to select in the input element.
     * This attribute is supported only for text type.
     * Use with selection-start to programmatically set or read the position of
     * selected text.
     */
    
    @api
    get selectionEnd() {
        if (this._inputElement && 'selectionEnd' in this._inputElement) {
            return this._inputElement.selectionEnd;
        }
        return undefined;
    }

    set selectionEnd(index) {
        if (this._inputElement && 'selectionEnd' in this._inputElement) {
            this._inputElement.selectionEnd = index;
        }
    }


    // ---- event management

    @api focus() {
        console.log('> focus');
        if (this._rendered) {
            this._inputElement.focus();
        }
    }

    @api blur() {
        if (this._rendered) {
            this._inputElement.blur();
        }
    }


    // ---- aria
/*
    get computedAriaControls() {
        const ariaValues = [];

        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaControls);
            ariaValues.push(this.timeAriaControls);
        }
        if (this.ariaControls) {
            ariaValues.push(this.ariaControls);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaLabel() {
        const ariaValues = [];

        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaLabel);
            ariaValues.push(this.timeAriaLabel);
        }
        if (this.ariaLabel) {
            ariaValues.push(this.ariaLabel);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaLabelledBy() {
        const ariaValues = [];

        if (this.isTypeFile) {
            ariaValues.push(this.computedUniqueFileElementLabelledById);
        }
        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaLabelledBy);
            ariaValues.push(this.timeAriaLabelledBy);
        }
        if (this.ariaLabelledBy) {
            ariaValues.push(this.ariaLabelledBy);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaDescribedBy() {
        const ariaValues = [];

        if (this._helpMessage) {
            ariaValues.push(this.computedUniqueHelpElementId);
        }
        // The toggle type is described by a secondary element
        if (this.isTypeToggle) {
            ariaValues.push(this.computedUniqueToggleElementDescribedById);
        }
        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaDescribedBy);
            ariaValues.push(this.timeAriaDescribedBy);
        }
        if (this.ariaDescribedBy) {
            ariaValues.push(this.ariaDescribedBy);
        }

        return normalizeAriaAttribute(ariaValues);
    }
*/
    get computedAriaInvalid() {
        // W-8796658: aria-invalid should always follow the visual indication of errors

        return !!this._helpMessage;
    }


    // ---- color

    get colorInputElementValue() {
        return this.validity.valid && this.value ? this.value : DEFAULT_COLOR;
    }

    get colorInputStyle() {
        return `background: ${this.value || '#5679C0'};`;
    }


    // ---- label IDs

    get computedUniqueHelpElementId() {
        return getRealDOMId(this.template.querySelector('[data-help-message]'));
    }

    get computedUniqueToggleElementDescribedById() {
        if (this.isTypeToggle) {
            const toggle = this.template.querySelector(
                '[data-toggle-description]'
            );
            return getRealDOMId(toggle);
        }
        return null;
    }

    get computedUniqueFormLabelId() {
        if (this.isTypeFile) {
            const formLabel = this.template.querySelector('[data-form-label]');
            return getRealDOMId(formLabel);
        }
        return null;
    }

    get computedUniqueFileSelectorLabelId() {
        if (this.isTypeFile) {
            const fileBodyLabel = this.template.querySelector(
                '[data-file-selector-label]'
            );
            return getRealDOMId(fileBodyLabel);
        }
        return null;
    }

    get computedUniqueFileElementLabelledById() {
        if (this.isTypeFile) {
            const labelIds = [
                this.computedUniqueFormLabelId,
                this.computedUniqueFileSelectorLabelId,
            ];
            return labelIds.join(' ');
        }
        return null;
    }


    // ---- classes

    get computedLabelClass() {
       return "";
    }

    get computedNumberClass() {
       return "";
    }

    get computedColorLabelClass() {
       return "";
    }

    get computedCheckboxClass() {
       return "";
    }


    get computedInputContainerClass() {
        return this.isTypeSearch ? "nsw-form-search" : "";
    }

    get computedInputClass() {
        return this.isTypeSearch ? "nsw-form-search__input" : "nsw-form-input";
    }


    // ---- types
    get isTypeNumber() {
        return this.type === 'number';
    }

    get isTypeEmail() {
        // To test against native change this to type="emails"
        return this.type === 'email';
    }

    get isTypeCheckable() {
        return (
            this.isTypeCheckbox ||
            this.isTypeCheckboxButton ||
            this.isTypeRadio ||
            this.isTypeToggle
        );
    }

    get isTypeSearch() {
        return this.type === 'search';
    }

    get isTypeToggle() {
        return this.type === 'toggle';
    }

    get isTypeText() {
        return this.type === 'text';
    }

    get isTypeCheckbox() {
        return this.type === 'checkbox';
    }

    get isTypeRadio() {
        return this.type === 'radio';
    }

    get isTypeCheckboxButton() {
        return this.type === 'checkbox-button';
    }

    get isTypeFile() {
        return this.type === 'file';
    }

    get isTypeColor() {
        return this.type === 'color';
    }

    get isTypeDate() {
        return this.type === 'date';
    }

    get isTypeDateTime() {
        return this.type === 'datetime' || this.type === 'datetime-local';
    }

    get isTypeTime() {
        return this.type === 'time';
    }

    get isTypeMobileDate() {
        return this.isTypeDate && !this._isDesktopBrowser();
    }

    get isTypeDesktopDate() {
        return this.isTypeDate && this._isDesktopBrowser();
    }

    get isTypeMobileDateTime() {
        return this.isTypeDateTime && !this._isDesktopBrowser();
    }

    get isTypeDesktopDateTime() {
        return this.isTypeDateTime && this._isDesktopBrowser();
    }

    get isTypeMobileTime() {
        return this.isTypeTime && !this._isDesktopBrowser();
    }

    get isTypeDesktopTime() {
        return this.isTypeTime && this._isDesktopBrowser();
    }

    get isTypeSimple() {
        return (
            !this.isTypeCheckbox &&
            !this.isTypeCheckboxButton &&
            !this.isTypeToggle &&
            !this.isTypeRadio &&
            !this.isTypeFile &&
            !this.isTypeColor &&
            !this.isTypeDesktopDate &&
            !this.isTypeDesktopDateTime &&
            !this.isTypeDesktopTime
        );
    }

    get _inputTypeForValidity() {
        let inputType = 'text';

        if (this.isTypeSimple) {
            if (this.isTypeEmail) {
                inputType = 'text';
            } else if (this.isTypeNumber) {
                inputType = 'number';
            } else {
                inputType = this.type;
            }
        } else if (this.isTypeCheckable) {
            inputType = this.isTypeRadio ? 'radio' : 'checkbox';
        } else if (this.isTypeFile) {
            inputType = 'file';
        } else if (this.isTypeDateTime) {
            inputType = 'datetime-local';
        } else if (this.isTypeTime) {
            inputType = 'time';
        } else if (this.isTypeDate) {
            inputType = 'date';
        }
        return inputType;
    }
 

    /**
     * Gets the value for the actual 'type' attribute on the input element.
     */
    
    get _internalType() {
        // Maps number->text to support shorthand input strings like '1k'.
        if (this.isTypeNumber || this.isTypeEmail) {
            return 'text';
        }

        return this._type;
    }

    get _showClearButton() {
        return (
            this.isTypeSearch &&
            isNotUndefinedOrNull(this._value) &&
            this._value !== ''
        );
    }

    get isNativeInput() {
        return !(
            this.isTypeDesktopDate ||
            this.isTypeDesktopDateTime ||
            this.isTypeDesktopTime
        );
    }


    // ---- all

    get _inputElement() {
        if (!this._cachedInputElement || this._inputElementRefreshNeeded) {
            this._inputDragonDecorated = false;
            let inputElement;
            if (this.isTypeDesktopDate) {
                //inputElement = this.template.querySelector('input');
                inputElement = this.template.querySelector('c-nsw-d-s-form-date-picker-base');
            }             /* TODO
            else if (this.isTypeDesktopDateTime) {
                inputElement = this.template.querySelector(
                    'lightning-datetimepicker'
                );
            } */ else if (this.isTypeDesktopTime) {
                inputElement = this.template.querySelector('c-nsw-d-s-form-time-picker-base');
            } else {
                inputElement = this.template.querySelector('input');
                this._inputDragonDecorated = true;
                decorateInputForDragon(inputElement);
            }
            this._inputElementRefreshNeeded = false;
            this._cachedInputElement = inputElement;
        }
        return this._cachedInputElement;
    }

    
    get _displayedValue() {
        if (this.isTypeNumber) {
            // When only a symbol is entered by the user, set the display value as the user's input.
            // This will not affect the value dispatched by input via the change event, as it only dispatches a valid decimal number.
            // Due to the above, in integrations like input-field, the user's initial input of a symbol
            // like a minus sign will not be overwritten by an empty string value.
            // See description in PR for more details: https://github.com/salesforce/lightning-components/pull/3843
            if (
                this._inputElement.value.length === 1 &&
                hasValidNumberSymbol(this._inputElement.value)
            ) {
                return this._inputElement.value;
            }

            // If the number is not valid (bad input, step mismatch, etc.) show the raw number as
            // well, otherwise the formatted value ends up being 'NaN' which makes it hard to
            // see mistakes
            if (this._showRawNumber || !this.validity.valid) {
                if (
                    hasValidNumberShortcut(this._numberRawValue) &&
                    isValidNumber(this._numberRawValue)
                ) {
                    this._numberRawValue = fromIsoDecimal(this._value);
                }
                return this._numberRawValue;
            }
            return formatNumber(
                this._value,
                this._buildFormatNumberOptions(this.formatter)
            );
        }

        if (
            this.isTypeMobileDate ||
            this.isTypeMobileDateTime ||
            this.isTypeMobileTime
        ) {
            return this._normalizeDateTimeString(this._value);
        }

        return this._value;
    }


    get _inputMode() {
        if (this.isTypeNumber) {
            return 'decimal';
        } else if (this.isTypeEmail) {
            return 'email';
        }
        return null;
    }


    _constraintApiProxyInputUpdater;

    get _constraint() {
        console.log('> get _constraint');

        if (!this._constraintApi) {
            const overrides = {
                badInput: () => {
                    if (!this._rendered) {
                        return false;
                    }

                    if (this.isTypeNumber) {
                        return !isValidNumber(this._numberRawValue);
                    }

                    if (!this.isNativeInput) {
                        return this._inputElement.hasBadInput();
                    }

                    return this._inputElement.validity.badInput;
                },
                tooLong: () =>
                    // since type=number is type=text in the dom when not in focus
                    // we should always return false as maxlength doesn't apply
                    this.isNativeInput &&
                    !this.isTypeNumber &&
                    this._rendered &&
                    this._inputElement.validity.tooLong,
                tooShort: () =>
                    // since type=number is type=text in the dom when not in focus
                    // we should always return false as minlength doesn't apply
                    this.isNativeInput &&
                    !this.isTypeNumber &&
                    this._rendered &&
                    this._inputElement.validity.tooShort,
                patternMismatch: () =>
                    this.isNativeInput &&
                    this._rendered &&
                    this._inputElement.validity.patternMismatch,
            };

            // International email support, note that the type="email" does not currently
            // support full unicode that 226+ now supports
            if (this.isTypeEmail) {
                overrides.typeMismatch = () => {
                    if (this._multiple) {
                        return !isValidMultipleEmails(this.value);
                    }
                    return !isValidEmail(this.value);
                };
            }
            // FF, IE and Safari don't support type datetime-local,
            // IE and Safari don't support type date or time
            // we need to defer to the base component to check rangeOverflow/rangeUnderflow.
            // Due to the custom override, changing the type to or from datetime/time would affect the validation
            if (this.isTypeDesktopDateTime ||
                this.isTypeDesktopTime ||
                this.isTypeDesktopDate) {
                    overrides.rangeOverflow = () => {
                    // input type='time' is timezone agnostic, so we should remove the timezone designator before comparison
                    const max = this.isTypeDesktopTime
                        ? normalizeTime(this.max)
                        : this.max;

                    return isAfter(this.value, max);
                };
                overrides.rangeUnderflow = () => {
                    // input type='time' is timezone agnostic, so we should remove the timezone designator before comparison
                    const min = this.isTypeDesktopTime
                        ? normalizeTime(this.min)
                        : this.min;

                    return isBefore(this.value, min);
                };
                overrides.stepMismatch = () => false;
            }

            if (this.isIE11) {
                overrides.stepMismatch = () => false;
            }

            this._constraintApi = new FieldConstraintApiWithProxyInput(() => {
                // The date/time components display their own errors and have custom messages for badInput and rangeOverflow/Underflow.
                if (!this.isNativeInput) {
                    return this._inputElement;
                }
                return this;
            }, overrides);

            // Buggy: This (or similar code) creates invalid DOM when attributes like 'step' are passed
            // directly along to the input element if the type doesn't allow those attributes.
            // For example: 'step' is allowed on type=number but not type=text.
            // See https://www.w3.org/TR/html52/sec-forms.html#apply for which attributes apply to which types.
            this._constraintApiProxyInputUpdater =
                this._constraintApi.setInputAttributes({
                    type: () => this._inputTypeForValidity,
                    // We need to normalize value so that it's consumable by the proxy input (otherwise the value
                    // will be invalid for the native input)
                    value: () => this._normalizeDateTimeString(this.value),
                    checked: () => this.checked,
                    maxlength: () => this.maxLength,
                    minlength: () => this.minLength,
                    // 'pattern' depends on type
                    pattern: () => this.pattern,
                    // 'max' and 'min' depend on type and timezone
                    max: () => this.normalizedMax,
                    min: () => this.normalizedMin,
                    step: () => this.step,
                    accept: () => this.accept,
                    multiple: () => this.multiple,
                    disabled: () => this.disabled,
                    readonly: () => this.readOnly,
                    // depends on type and whether an upload has been made
                    required: () => this.required && !this._ignoreRequired,
                });
        }
        return this._constraintApi;
    }


    get hasExternalLabel() {
        return false;
    }


    // ---- event management
    handleFileClick() {
        this._setInputValue(null);
        this._updateValueAndValidityAttribute(null);
    }

    handleDropFiles(event) {
        // drop doesn't trigger focus nor blur, so set state to interacting
        // and auto leave when there's no more action
        this.interactingState.interacting();

        this.fileUploadedViaDroppableZone = true;
        this._files = event.dataTransfer && event.dataTransfer.files;

        this._updateProxyInputAttributes('required');

        this._dispatchChangeEventWithDetail({
            files: this._files,
        });
    }

    /**
     * Handle text selection.
     * Dynamically bound to the select event by `renderedCallback`.
     * This allows us to cache text selection in Safari, which doesn't preserve selection.
     */


    handleSelect() {
        if (isSafari) {
            this._selectionCache.preserve(this._inputElement);
        }
    }

    handleFocus() {
        this.interactingState.enter();

        if (this.isTypeColor) {
            this._isColorPickerPanelOpen = false;
        }

        // Focusing a number input causes the value displayed to be modified.
        // Changing the value resets selection, so we save and restore selection.
        if (this._rendered && this.isTypeNumber) {
            this._showRawNumber = true;
            this._selectionCache.preserve(this._inputElement);
            this._inputElement.value = this._displayedValue;
            this._selectionCache.restore(this._inputElement);
        }

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur(event) {
        this.interactingState.leave();
        if (this._rendered && this.isTypeNumber) {
            this._showRawNumber = false;
            this._setInputValue(this._displayedValue);
        }

        if (
            !event.relatedTarget ||
            !this.template.contains(event.relatedTarget)
        ) {
            this.dispatchEvent(new CustomEvent('blur'));
        }
    }

    handleChange(event) {
        event.stopPropagation();
        console.log('handleChange');

        this._dispatchCommitEvent();

        if (this.isTypeSimple && this.value === event.target.value) {
            return;
        }

        this._dispatchChangeEvent();
    }

    handleInput(event) {
        event.stopPropagation();

        if (this.isTypeNumber) {
            // for invalid numbers the value might stay the same as the user
            // changed the invalid input, so we need to update the raw value
            this._numberRawValue = this._inputElement.value;
        }

        if (this.isTypeSimple && this.value === event.target.value) {
            return;
        }

        this._dispatchChangeEvent();
    }

    handleKeyDown(event) {
        if (this.isTypeNumber) {
            // we're letting "Shift" through to prevent capital letters, other special symbols for type="number"
            const hasMetaOrCtrlModifier = event.metaKey || event.ctrlKey;
            // need to check that event.key is valid for "autofill" cases
            if (!hasMetaOrCtrlModifier && !this.readOnly && event.key) {
                const key = normalizeKeyValue(event.key);

                if (key.length === 1 && !isValidNumberCharacter(key)) {
                    event.preventDefault();
                }

                if (key === 'ArrowUp') {
                    event.preventDefault();
                    this._numberStepUpAndDispatchEvents(1);
                } else if (key === 'ArrowDown') {
                    event.preventDefault();
                    this._numberStepUpAndDispatchEvents(-1);
                }
            }
        }
    }

    handleColorChange(event) {
        const selectedColor = event.detail.color;
        if (selectedColor !== this._inputElement.value) {
            this._setInputValue(selectedColor);
            this._updateValueAndValidityAttribute(selectedColor);
            this.focus();
            this._dispatchChangeEventWithDetail({ value: selectedColor });
            this._dispatchCommitEvent();
        }
        this.template
            .querySelector('lightning-primitive-colorpicker-button')
            .focus();
    }

    _clearAndSetFocusOnInput(event) {
        // TODO: Discuss this, it seems the wrong thing to do.
        // button is removed from template, but
        // event still is propagated, For example, captured by panel,
        // then cause panel think is clicked outside.
        event.stopPropagation();

        this.interactingState.enter();
        this._setInputValue('');
        this._updateValueAndValidityAttribute('');

        this._inputElement.focus();

        this._dispatchChangeEventWithDetail({
            value: this._value,
        });

        this._dispatchCommitEvent();
    }

    _dispatchCommitEvent() {
        this.dispatchEvent(new CustomEvent('commit'));
    }

    _dispatchChangeEventWithDetail(detail) {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail,
            })
        );
    }

    _setInputValue(value) {
        if (this._inputDragonDecorated) {
            // The underlying input has been modified to dispatch an 'input' event when a direct value set
            // is used to allow for Dragon Natural Speaking (which sets the value directly on the inputs instead
            // dispatching an input event against the input). Since we're in a programatic set here (ie. set
            // not resulting from a direct user interaction) we want a default setter behaviour that doesn't
            // dispatch any events.
            setDecoratedDragonInputValueWithoutEvent(this._inputElement, value);
        } else {
            this._inputElement.value = value;
        }
    }

    _dispatchChangeEvent() {
        console.log('_dispatchChangeEvent');
        this.interactingState.enter();

        const detail = {};

        if (this.isTypeCheckable) {
            this._updateCheckedAndValidityAttribute(this._inputElement.checked);
            detail.checked = this._checked;
        } else if (this.isTypeFile) {
            this._files = this._inputElement.files;

            // LWC does not proxy dom elements any more. So there is no need to call lwc.unwrap here anymore
            detail.files = this._files;

            this._updateProxyInputAttributes('required');
        }

        if (!this.isTypeCheckable) {
            if (this.isTypeNumber) {
                this._numberRawValue = this._inputElement.value;
                detail.value = toIsoDecimal(this._inputElement.value);
            } else {
                detail.value = this._inputElement.value;
            }

            if (this.isTypeMobileDateTime) {
                detail.value = normalizeDateTimeToUTC(
                    detail.value,
                    this.timezone
                );
            } else if (this.isTypeMobileTime) {
                detail.value = normalizeTime(detail.value);
            }

            console.log('prior _updateValueAndValidityAttribute');
            this._updateValueAndValidityAttribute(detail.value);
        }

        console.log('prior _dispatchChangeEventWithDetail');
        this._dispatchChangeEventWithDetail(detail);
    }


    // ---- all generation validations

    _validateType(type) {
        assert(
            type !== 'hidden',
            `<lightning-input> The type attribute value "hidden" is invalid. Use a regular <input type="hidden"> instead.`
        );
        assert(
            type !== 'submit' &&
                type !== 'reset' &&
                type !== 'image' &&
                type !== 'button',
            `<lightning-input> The type attribute value "${type}" is invalid. Use <lightning:button> instead.`
        );
        if (this.isTypeRadio) {
            assert(
                !this.required,
                `<lightning-input> The required attribute is not supported on radio inputs directly. It should be implemented at the radio group level.`
            );
        }
    }

    _validateRequiredAttributes() {
        const { label } = this;
        assert(
            typeof label === 'string' && label.length,
            `<lightning-input> The required label attribute value "${label}" is invalid.`
        );
    }


    // ---- all utilities

    _isDesktopBrowser() {
        return formFactor === 'Large';
    }

    _updateValueAndValidityAttribute(value) {
        this._value = value;
        console.log('_updateValueAndValidityAttribute to ', value);
        this._updateProxyInputAttributes('value');
    }

    _updateCheckedAndValidityAttribute(value) {
        this._checked = value;
        this._updateProxyInputAttributes('checked');
    }

    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }

    _updateInputDisplayValueIfTypeNumber() {
        // Displayed value depends on the format number, so if we're not showing the raw
        // number we should update the value
        if (
            this._rendered &&
            this.isTypeNumber &&
            !this._showRawNumber &&
            this._inputElement
        ) {
            this._setInputValue(this._displayedValue);
        }
    }


    /**
     * Increases (if increment is positive, decreases otherwise) the number value of the input by the increment
     * multiple of the given 'step'. Additionally dispatches the 'change' and 'commit' events.
     *
     * @param {Number} increment A multiple of the step to increase, when step is 'any',
     * the step is assumed to be 1.
     * @private
     */
    
    _numberStepUpAndDispatchEvents(increment) {
        if (this._readOnly || this._disabled) {
            return;
        }
        this._value = increaseNumberByStep({
            value: this._value,
            step: this.step,
            increment,
            fractionDigits: this._buildFormatNumberOptions(this.formatter)
                .minimumFractionDigits,
        });

        // Raw value is the value the user entered (we preserve a user's input),
        // since we're generating a new value we're overriding it
        this._numberRawValue = fromIsoDecimal(this._value);

        this._setInputValue(this._displayedValue);

        this._dispatchChangeEvent();
        this._dispatchCommitEvent();
    }

    _updateNumberValue(value) {
        const newValue = normalizeNumber(value);
        this._value = newValue;
        this._numberRawValue = fromIsoDecimal(newValue);
    }

    _buildFormatNumberOptions(formatter) {
        const options = {
            style: formatter,
        };
        // Use the min/max fraction digits from the formatFractionDigits provided by the user if available.
        // Otherwise, use the number of digits calculated from step
        if (this._formatFractionDigits !== undefined) {
            options.minimumFractionDigits = this._formatFractionDigits;
            options.maximumFractionDigits = this._formatFractionDigits;
        } else {
            let digitsFromStep = calculateFractionDigitsFromStep(this._step);
            // if formatting percentages, when calculating digits from step, take into
            // consideration that the formatted number is effectively multiplied by 10^2, ie. 0.1 is 10%
            // so we need to subtract 2 digits;
            if (formatter === 'percent' && typeof digitsFromStep === 'number') {
                digitsFromStep -= 2;
                if (digitsFromStep < 0) {
                    digitsFromStep = 0;
                }
            }

            options.minimumFractionDigits = digitsFromStep;
            options.maximumFractionDigits = digitsFromStep;
        }
        return options;
    }

    _normalizeDateTimeString(value) {
        let result = value;
        if (this.isTypeDate) {
            result = normalizeDate(value);
        } else if (this.isTypeTime) {
            result = normalizeTime(value);
        } else if (this.isTypeDateTime) {
            result = normalizeUTCDateTime(value, this.timezone);
        }
        return result;
    }
/*
    _synchronizeA11y() {
        const input = this.template.querySelector('input');
        const datepicker = this.template.querySelector('c-nsw-d-s-form-date-picker-base');
        const timepicker = this.template.querySelector('c-nsw-d-s-form-time-picker-base');

        if (input) {
            synchronizeAttrs(input, {
                [ARIA_LABELEDBY]: this.computedAriaLabelledBy,
                [ARIA_DESCRIBEDBY]: this.computedAriaDescribedBy,
                [ARIA_CONTROLS]: this.computedAriaControls,
                [ARIA_LABEL]: this.computedAriaLabel,
            });
        } else if (datepicker) {
            synchronizeAttrs(datepicker, {
                ariaLabelledByElement: this.ariaLabelledBy,
                ariaDescribedByElements: this.ariaDescribedBy,
                ariaControlsElement: this.ariaControls,
                [ARIA_LABEL]: this.computedAriaLabel,
            });
        } else if (timepicker) {
            synchronizeAttrs(timepicker, {
                ariaLabelledByElement: this.ariaLabelledBy,
                ariaDescribedByElements: this.ariaDescribedBy,
                ariaControlsElement: this.ariaControls,
                [ARIA_LABEL]: this.computedAriaLabel,
            });
        }
    }
    */
}

NswDSInputBase.interopMap = {
    exposeNativeEvent: {
        change: true,
        focus: true,
        blue: true
    }
};