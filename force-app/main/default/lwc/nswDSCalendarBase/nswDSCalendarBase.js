/*
import labelAriaLabelMonth from '@salesforce/label/LightningDateTimePicker.ariaLabelMonth';
import labelNextMonth from '@salesforce/label/LightningDateTimePicker.nextMonth';
import labelPreviousMonth from '@salesforce/label/LightningDateTimePicker.previousMonth';
import labelToday from '@salesforce/label/LightningDateTimePicker.today';
import labelYearSelector from '@salesforce/label/LightningDateTimePicker.yearSelector';
*/

import { LightningElement, track, api } from 'lwc';

import { classSet } from 'c/nswUtils';
import { generateUniqueId } from 'c/nswInputUtils';
import firstDayOfWeek from '@salesforce/i18n/firstDayOfWeek';
import { handleKeyDownOnCalendar } from './keyboard';
import salesforceLanguage from '@salesforce/i18n/lang';
import showJapaneseCalendar from '@salesforce/i18n/showJapaneseCalendar';
import {
    toOtherCalendar,
    toLocalizedDigits,
    getToday,
    isBefore,
    isAfter,
    parseDateTime,
    getISODateString,
    getNameOfWeekdays,
    getMonthNames,
} from 'c/nswInternationalizationLibrary';
import { STANDARD_DATE_FORMAT, TIME_SEPARATOR } from 'c/nswIso8601Utils';

const i18n = {
    ariaLabelMonth: "month", //TODO labelAriaLabelMonth,
    nextMonth: ">", //labelNextMonth,
    previousMonth: "<", //labelPreviousMonth,
    today: "today", //labelToday,
    yearSelector: "year", //labelYearSelector,
};

const WEEKS_PER_MONTH = 6;
const DAYS_PER_WEEK = 7;
const calendarCache = {}; // cache of calendar cells for a given year/month

// Japanese Era (https://en.wikipedia.org/wiki/Regnal_year#Japanese)
const JAPANESE_CALENDAR_YEARS = [
    // note: the order matters. the latest comes first.
    { key: 'R', year: 2019, label: '\u4ee4\u548c' }, // Reiwa:   5/1/2019
    { key: 'H', year: 1989, label: '\u5e73\u6210' }, // Heisei:  1/8/1989
    { key: 'S', year: 1926, label: '\u662d\u548c' }, // Showa:  12/25/1926
    { key: 'T', year: 1912, label: '\u5927\u6b63' }, // Taisho:  7/30/1912
    { key: 'M', year: 1868, label: '\u660e\u6cbb' }, // Meiji:   1/1/1868
];

export default class NswDSCalendarBase extends LightningElement {
    @track calendarYear = null;
    @track calendarMonth = null;

    @api min;
    @api max;

    @api
    get value() {
        return this.selectedDate;
    }
    set value(newValue) {
        // if value is an ISO string, only fetch the time part
        const dateOnlyString =
            typeof newValue === 'string'
                ? newValue.split(TIME_SEPARATOR)[0]
                : newValue;

        if (dateOnlyString !== this.selectedDate) {
            this.selectedDate = dateOnlyString;

            if (!this._connected) {
                return;
            }

            const newDate = this.parseDate(dateOnlyString);

            // if the date is invalid, render today's date
            if (!newDate) {
                this.selectedDate = null;

                this.renderToday();
            } else {
                this.selectDate(newDate);
            }
        }
    }

    constructor() {
        super();
        this.uniqueId = generateUniqueId();
    }

    renderedCallback() {
        this.dispatchEvent(new CustomEvent('ready'));
    }

    connectedCallback() {
        this._connected = true;

        this.todayDate = getToday();
        const renderDate = this.getSelectedDate() || this.getTodaysDate();
        this.renderCalendar(renderDate);

        this.keyboardInterface = this.calendarKeyboardInterface();
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Sets focus on the focusable date cell in the calendar.
     */
    @api
    focus() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            const dateElement = this.getFocusableDateCell();
            if (dateElement) {
                dateElement.focus();
            }
        });
    }

    get i18n() {
        return i18n;
    }

    get computedAriaLabel() {
        const renderedMonth = this.getCalendarDate().getMonth();
        return i18n.ariaLabelMonth + getMonthNames()[renderedMonth].fullName;
    }

    get computedMonthTitle() {
        const renderedMonth = this.getCalendarDate().getMonth();
        return getMonthNames()[renderedMonth].fullName;
    }

    get computedWeekdayLabels() {
        const nameOfWeekdays = getNameOfWeekdays();
        const firstDay = this.getFirstDayOfWeek();
        const computedWeekdayLabels = [];

        // We need to adjust the weekday labels to start from the locale's first day of week
        for (let i = firstDay; i < nameOfWeekdays.length; i++) {
            computedWeekdayLabels.push(nameOfWeekdays[i]);
        }
        for (let i = 0; i < firstDay; i++) {
            computedWeekdayLabels.push(nameOfWeekdays[i]);
        }

        return computedWeekdayLabels;
    }

    get computedSelectElementId() {
        return this.uniqueId + '-select';
    }

    get computedWeekdaysElementId() {
        return this.uniqueId + '-weekdays';
    }

    get computedMonthTitleId() {
        return this.uniqueId + '-month';
    }

    get computedYearList() {
        const sampleDate = new Date();
        const currentYear = sampleDate.getFullYear();

        const minDate = this.parseDate(this.min);
        const maxDate = this.parseDate(this.max);

        const minYear = minDate ? minDate.getFullYear() : currentYear - 100;
        const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 100;

        const yearList = [];
        for (let year = minYear; year <= maxYear; year++) {
            yearList.push({
                label: this.getYearDisplayValue(sampleDate, year),
                value: year,
            });
        }
        return yearList;
    }

    get monthIndex() {
        return this.getCalendarDate().getMonth();
    }

    getJapaneseCalendarYear(year) {
        const JAPANESE = 'ja';
        const displayValue = (japaneseYearData, useKey) => {
            return useKey ? japaneseYearData.key : japaneseYearData.label;
        };

        let useShortName = salesforceLanguage !== JAPANESE;
        for (let i = 0; i < JAPANESE_CALENDAR_YEARS.length; i++) {
            if (year < JAPANESE_CALENDAR_YEARS[i].year) {
                continue;
            }

            let jpYear =
                displayValue(JAPANESE_CALENDAR_YEARS[i], useShortName) +
                (year - JAPANESE_CALENDAR_YEARS[i].year + 1);

            if (
                year === JAPANESE_CALENDAR_YEARS[i].year &&
                i < JAPANESE_CALENDAR_YEARS.length - 1
            ) {
                // transition year -- display both
                let previousJapaneseYearData = JAPANESE_CALENDAR_YEARS[i + 1];
                jpYear +=
                    '/' +
                    displayValue(previousJapaneseYearData, useShortName) +
                    (year - previousJapaneseYearData.year + 1);
            }
            return jpYear;
        }
        return null;
    }

    getYearDisplayValue(date, yearValue) {
        date.setFullYear(yearValue);

        let displayValue = toLocalizedDigits(
            String(toOtherCalendar(date).getFullYear())
        );

        // additional display value for Japanese calendar year support
        if (showJapaneseCalendar) {
            let jpYear = this.getJapaneseCalendarYear(yearValue);
            if (jpYear) {
                displayValue += ' (' + jpYear + ')';
            }
        }
        return displayValue;
    }

    get computedMonth() {
        if (!this._connected) {
            return [];
        }

        this.removeCurrentlySelectedDateAttributes();

        const selectedDate = this.getSelectedDate();
        const renderDate = this.getCalendarDate();

        const cacheKey = this.getCalendarCacheKey(renderDate, selectedDate);
        if (cacheKey in calendarCache) {
            return calendarCache[cacheKey];
        }

        const todayDate = this.getTodaysDate();
        const focusableDate = this.getInitialFocusDate(
            todayDate,
            selectedDate,
            renderDate
        );

        const calendarDates = {
            selectedDate,
            renderDate,
            focusableDate,
            todayDate,
            minDate: this.parseDate(this.min),
            maxDate: this.parseDate(this.max),
        };

        const monthCells = [];
        const date = this.getCalendarStartDate(renderDate);
        for (let week = 0; week < WEEKS_PER_MONTH; week++) {
            const weekCells = {
                id: week,
                days: [],
            };
            for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday++) {
                const dayCell = this.getDateCellAttributes(date, calendarDates);
                weekCells.days.push(dayCell);

                date.setDate(date.getDate() + 1);
            }

            monthCells.push(weekCells);
        }

        calendarCache[cacheKey] = monthCells;
        return monthCells;
    }

    getDateCellAttributes(date, calendarDates) {
        const isInAdjacentMonth =
            !this.dateInCalendar(date, calendarDates.renderDate) ||
            !this.isBetween(date, calendarDates.minDate, calendarDates.maxDate);

        const isSelected = this.isSame(date, calendarDates.selectedDate);
        const isToday = this.isSame(date, calendarDates.todayDate);
        const ariaCurrent = isToday ? 'date' : false;
        const tabIndex = this.isSame(date, calendarDates.focusableDate)
            ? '0'
            : false;

        const className = classSet()
            .add({
                'slds-is-today': isToday,
                'slds-is-selected': isSelected,
                'slds-day_adjacent-month': isInAdjacentMonth,
            })
            .toString();

        return {
            dayInMonth: toLocalizedDigits(String(date.getDate())),
            dateValue: this.formatDate(date),
            isSelected: isSelected ? 'true' : 'false',
            className,
            tabIndex,
            ariaCurrent,
        };
    }

    dispatchSelectEvent() {
        this.dispatchEvent(
            new CustomEvent('select', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: { value: this.selectedDate },
            })
        );
    }

    // Determines if the date is in the rendered month/year calendar.
    dateInCalendar(date, calendarDate) {
        const renderedCalendar = calendarDate || this.getCalendarDate();
        return (
            date.getMonth() === renderedCalendar.getMonth() &&
            date.getFullYear() === renderedCalendar.getFullYear()
        );
    }

    getInitialFocusDate(todayDate, selectedDate, renderedDate) {
        if (selectedDate && this.dateInCalendar(selectedDate, renderedDate)) {
            return selectedDate;
        }
        if (this.dateInCalendar(todayDate, renderedDate)) {
            return todayDate;
        }
        return new Date(renderedDate.getFullYear(), renderedDate.getMonth(), 1);
    }

    getTodaysDate() {
        if (this.todayDate) {
            return this.parseDate(this.todayDate);
        }
        // Today's date will be fetched in connectedCallback. In the meantime, use the date based on the device timezone.
        return new Date();
    }

    getSelectedDate() {
        return this.parseDate(this.selectedDate);
    }

    // returns the month and year in the calendar
    getCalendarDate() {
        if (this.calendarYear) {
            return new Date(this.calendarYear, this.calendarMonth, 1);
        }
        return this.getTodaysDate();
    }

    getCalendarStartDate(renderedDate) {
        const firstDayOfMonth = new Date(
            renderedDate.getFullYear(),
            renderedDate.getMonth(),
            1
        );

        return this.getStartOfWeek(firstDayOfMonth);
    }

    getStartOfWeek(dayInWeek) {
        const firstDay = this.getFirstDayOfWeek();

        // Negative dates in JS will subtract days from the 1st of the given month
        let startDay = dayInWeek.getDay();
        while (startDay !== firstDay) {
            dayInWeek.setDate(dayInWeek.getDate() - 1);
            startDay = dayInWeek.getDay();
        }
        return dayInWeek;
    }

    getFirstDayOfWeek() {
        return firstDayOfWeek - 1; // In Java, week days are 1 - 7
    }

    // This method is called when a new value is set, or when you click the today button.
    // In both cases, we need to check if newValue is in the currently rendered calendar
    selectDate(newDate) {
        if (this.dateInCalendar(newDate)) {
            const dateElement = this.getElementByDate(this.formatDate(newDate));
            this.selectDateInCalendar(dateElement);
        } else {
            this.renderCalendar(newDate);
        }
    }

    // Select a date in current calendar without the need to re-render the calendar
    selectDateInCalendar(dateElement) {
        this.selectedDate = dateElement.getAttribute('data-value');

        this.removeCurrentlySelectedDateAttributes();
        this.addSelectedDateAttributes(dateElement);
    }

    selectDateInCalendarAndDispatchSelect(dateElement) {
        this.selectDateInCalendar(dateElement);
        this.dispatchSelectEvent();
    }

    // we should be able to control the select value with an attribute once we have a select component
    selectYear(year) {
        const optionElement = this.template.querySelector(
            `option[value='${year}']`
        );
        if (optionElement) {
            optionElement.selected = true;
        }
    }

    getElementByDate(dateString) {
        return this.template.querySelector(`td[data-value='${dateString}']`);
    }

    getFocusableDateCell() {
        return this.template.querySelector(`td[tabIndex='0']`);
    }

    unfocusDateCell(element) {
        if (element) {
            element.removeAttribute('tabIndex');
        }
    }

    focusDateCell(element) {
        if (element) {
            element.setAttribute('tabIndex', 0);
            element.focus();
        }
    }

    focusElementByDate(date) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            const element = this.getElementByDate(this.formatDate(date));
            if (element) {
                this.unfocusDateCell(this.getFocusableDateCell());
                this.focusDateCell(element);
            }
        });
    }

    renderCalendar(newDate) {
        this.calendarMonth = newDate.getMonth();
        this.calendarYear = newDate.getFullYear();

        this.selectYear(newDate.getFullYear());
    }

    renderToday() {
        const todaysDate = this.getTodaysDate();

        if (this.dateInCalendar(todaysDate)) {
            this.removeCurrentlySelectedDateAttributes();

            this.unfocusDateCell(this.getFocusableDateCell());

            const todayElement = this.getElementByDate(this.todayDate);
            todayElement.setAttribute('tabIndex', 0);
        } else {
            this.renderCalendar(todaysDate);
        }
    }

    removeCurrentlySelectedDateAttributes() {
        const currentlySelectedElement = this.template.querySelector(
            `td[class*='slds-is-selected']`
        );
        if (currentlySelectedElement) {
            currentlySelectedElement.classList.remove('slds-is-selected');
            currentlySelectedElement.setAttribute('aria-selected', 'false');
        }
        this.unfocusDateCell(this.getFocusableDateCell());
    }

    addSelectedDateAttributes(dateElement) {
        this.focusDateCell(dateElement);

        dateElement.classList.add('slds-is-selected');
        dateElement.setAttribute('aria-selected', 'true');
    }

    handleCalendarKeyDown(event) {
        const dateString = event.target.getAttribute('data-value');

        handleKeyDownOnCalendar(
            event,
            this.parseDate(dateString),
            this.keyboardInterface
        );
    }

    handleDateClick(event) {
        event.stopPropagation();

        const tdElement = event.target.parentElement;
        this.selectDateInCalendarAndDispatchSelect(tdElement);
    }

    handleTodayClick(event) {
        event.stopPropagation();

        this.selectedDate = this.todayDate;
        this.selectDate(this.getTodaysDate());

        this.dispatchSelectEvent();
    }

    handleYearSelectClick(event) {
        event.stopPropagation();
    }

    handleYearChange(event) {
        event.stopPropagation();

        const newYearValue = event.target.value;
        if (this.calendarYear !== newYearValue) {
            this.calendarYear = newYearValue;
        }
    }

    goToNextMonth(event) {
        event.stopPropagation();

        const calendarDate = this.getCalendarDate();
        calendarDate.setMonth(calendarDate.getMonth() + 1);

        this.renderCalendar(calendarDate);
    }

    goToPreviousMonth(event) {
        event.stopPropagation();

        const calendarDate = this.getCalendarDate();
        calendarDate.setMonth(calendarDate.getMonth() - 1);

        this.renderCalendar(calendarDate);
    }

    calendarKeyboardInterface() {
        const that = this;
        return {
            focusDate(newDate) {
                if (!that.dateInCalendar(newDate)) {
                    that.renderCalendar(newDate);
                }

                that.focusElementByDate(newDate);
            },
            getStartOfWeek(dayInWeek) {
                return that.getStartOfWeek(dayInWeek);
            },
            selectDate(dateElement) {
                that.selectDateInCalendarAndDispatchSelect(dateElement);
            },
        };
    }

    formatDate(date) {
        return getISODateString(date);
    }

    parseDate(dateString) {
        return parseDateTime(dateString, STANDARD_DATE_FORMAT, true);
    }

    isSame(date1, date2) {
        if (!date1 || !date2) {
            return false;
        }
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate() // getDate returns the day in month whereas getDay returns the weekday number
        );
    }

    isBetween(date, date1, date2) {
        let isBeforeEndDate = true;
        let isAfterStartDate = true;

        if (date2) {
            isBeforeEndDate =
                isBefore(date, date2, 'day') || this.isSame(date, date2);
        }

        if (date1) {
            isAfterStartDate =
                isAfter(date, date1, 'day') || this.isSame(date, date1);
        }

        return isBeforeEndDate && isAfterStartDate;
    }

    getCalendarCacheKey(renderDate, selectedDate) {
        let key = renderDate.getFullYear() + '-' + renderDate.getMonth();
        // Having the key include min/max seems enough for now.
        // We're not going to complicate things by checking if renderDate falls before/after the min/max.
        key += this.min ? 'min' + this.min : '';
        key += this.max ? 'max' + this.max : '';

        if (selectedDate && this.dateInCalendar(selectedDate, renderDate)) {
            key += '_' + selectedDate.getDate();
        }
        return key;
    }
}
