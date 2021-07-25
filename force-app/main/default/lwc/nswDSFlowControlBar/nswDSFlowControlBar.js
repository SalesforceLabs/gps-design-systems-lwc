import { LightningElement, api } from "lwc";
import { 
    FlowAttributeChangeEvent, 
    FlowNavigationPauseEvent, 
    FlowNavigationBackEvent, 
    FlowNavigationNextEvent,
    FlowNavigationFinishEvent 
} from "lightning/flowSupport";

const i18n = {
   pause: "Pause",
   previous: "Previous",
   next: "Next",
   finish: "Submit"
};

export default class NswDSFlowControlBar extends LightningElement {
    get i18n() {
        return i18n;
    }

    @api availableActions = [];
    @api labelForPause = i18n.pause;
    @api labelForPrevious = i18n.previous;
    @api labelForNext = i18n.next;
    @api labelForFinish = i18n.finish;

    get hasPause() {
        return this.availableActions.find(action => action === "PAUSE");
    }

    get hasPrevious() {
        return this.availableActions.find(action => action === "BACK");
    }

    get hasNext() {
        return this.availableActions.find(action => action === "NEXT");
    }

    get hasFinish() {
        return this.availableActions.find(action => action === "FINISH");
    }

    handlePause(event) {
        const npe = new FlowNavigationPauseEvent();
        this.dispatchEvent(npe);
    }

    handlePrevious(event) {
        const nbe = new FlowNavigationBackEvent();
        this.dispatchEvent(nbe);
    }

    handleNext(event) {
        const nne = new FlowNavigationNextEvent();
        this.dispatchEvent(nne);
    }

    handleFinish(event) {
        const nfe = new FlowNavigationFinishEvent();
        this.dispatchEvent(nfe);
    }
}