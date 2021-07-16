import { normalizeKeyValue } from 'c/nswUtilsPrivate';

export function handleKeyDownOnCalendar(event, date, calendarInterface) {
    const tdElement = event.target;
    const keyValue = normalizeKeyValue(event.key);
    switch (keyValue) {
        case 'ArrowUp':
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() - 7);
            calendarInterface.focusDate(date);
            break;
        case 'ArrowDown':
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() + 7);
            calendarInterface.focusDate(date);
            break;
        case 'ArrowRight':
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() + 1);
            calendarInterface.focusDate(date);
            break;
        case 'ArrowLeft':
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() - 1);
            calendarInterface.focusDate(date);
            break;
        case 'Enter':
        case ' ':
            preventDefaultAndStopPropagation(event);
            calendarInterface.selectDate(tdElement);
            break;
        case 'PageUp':
            preventDefaultAndStopPropagation(event);
            if (event.altKey) {
                date.setFullYear(date.getFullYear() - 1);
            } else {
                date.setMonth(date.getMonth() - 1);
            }
            calendarInterface.focusDate(date);
            break;
        case 'PageDown':
            preventDefaultAndStopPropagation(event);
            if (event.altKey) {
                date.setFullYear(date.getFullYear() + 1);
            } else {
                date.setMonth(date.getMonth() + 1);
            }
            calendarInterface.focusDate(date);
            break;
        case 'Home': {
            preventDefaultAndStopPropagation(event);
            const startOfWeek = calendarInterface.getStartOfWeek(date);
            calendarInterface.focusDate(startOfWeek);
            break;
        }
        case 'End': {
            preventDefaultAndStopPropagation(event);
            const endOfWeek = calendarInterface.getStartOfWeek(date);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            calendarInterface.focusDate(endOfWeek);
            break;
        }
        default:
    }
}

function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
}
