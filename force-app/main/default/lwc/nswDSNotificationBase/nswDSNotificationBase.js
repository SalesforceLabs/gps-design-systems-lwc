import { LightningElement, api } from 'lwc';

export default class NswDSNotificationBase extends LightningElement {
    @api title;


    // ---- type: string enum [error, warning, success, info]
    
    _typeOptions = {
        error: "cancel",
        warning: "error",
        success: "check_circle",
        info: "info"
    };
    
    @api type = "info";

    get notificationClass() {
        return "nsw-notification nsw-notification--" + this.type;
    }

    get hasIcon() {
        return this._typeOptions.hasOwnProperty(this.type);
    }
    
    get iconName() {
        return this._typeOptions[this.type];
    };

    @api nswClass;
}