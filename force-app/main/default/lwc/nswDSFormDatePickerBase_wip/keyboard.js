import { normalizeKeyValue } from 'c/nswUtilsPrivate';

export function handleKeyDownOnDatePickerIcon(event, datepickerInterface) {
    switch (normalizeKeyValue(event.key)) {
        case 'Enter':
        case ' ':
            preventDefaultAndStopPropagation(event);
            datepickerInterface.showCalendar();
            break;
        case 'Escape':
            preventDefaultAndStopPropagation(event);
            datepickerInterface.hideCalendar();
            break;
        default:
    }
}

export function handleBasicKeyDownBehaviour(event, datepickerInterface) {
    if (!datepickerInterface.isCalendarVisible()) {
        return;
    }

    if (normalizeKeyValue(event.key) === 'Escape') {
        preventDefaultAndStopPropagation(event);
        datepickerInterface.hideCalendar();
    }
}

function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
}
