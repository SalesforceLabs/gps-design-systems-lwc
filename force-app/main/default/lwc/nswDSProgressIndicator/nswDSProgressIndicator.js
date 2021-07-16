import { LightningElement, api } from 'lwc';

const MAX_STEPS = 16;

export default class NswDSProgressIndicator extends LightningElement {

    // ---- currentStep
    _currentStep = 1;

    @api get currentStep() {
        return this._currentStep
    }

    set currentStep(value) {
        try {
            this._currentStep = Math.min(MAX_STEPS, parseInt(value));
        } catch(e) {
            this._currentStep = 1;
        }
    }

    // ---- totalSteps
    _totalSteps = 1;

    @api get totalSteps() {
        return this._totalSteps;
    }

    set totalSteps(value) {
        try {
            this._totalSteps = Math.min(MAX_STEPS, parseInt(value));
        } catch(e) {
            this._totalSteps = 1;
        }
    }

    
    get _activeSteps() {
        let as = [];
        for (let i = 0; i < Math.min(this._currentStep, this._totalSteps); i++) {
            as.push({ key: i });
        }

        return as;
    }

    get _inactiveSteps() {
        let as = [];
        for (let i = Math.min(this._currentStep, this._totalSteps); i < this._totalSteps; i++) {
            as.push({ key: i });
        }

        return as;
    }

    @api nswClass;
}