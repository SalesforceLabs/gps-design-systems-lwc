import {
    getISOTimeString,
    parseTime,
} from 'c/nswInternationalizationLibrary';

/* returns the closes time in the list that should be highlighted in case the value is not in the list. E.g.
- if value is 16:18 and the list has 15 minute intervals, returns 16:30
*/
export function getTimeToHighlight(value, step) {
    const selectedTime = parseTime(value);
    if (!selectedTime) {
        return null;
    }
    selectedTime.setSeconds(0, 0);

    let closestHour = selectedTime.getHours();
    let closestMinute = selectedTime.getMinutes();

    const mod = closestMinute % step;
    const quotient = Math.floor(closestMinute / step);

    if (mod !== 0) {
        const multiplier = mod < step / 2 ? quotient : quotient + 1;
        closestMinute = multiplier * step;
        if (closestMinute >= 60) {
            if (closestHour === 23) {
                closestMinute -= step;
            } else {
                closestMinute = 0;
                closestHour++;
            }
        }
        selectedTime.setHours(closestHour);
        selectedTime.setMinutes(closestMinute);
    }

    return getISOTimeString(selectedTime);
}
