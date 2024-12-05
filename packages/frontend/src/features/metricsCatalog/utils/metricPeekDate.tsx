import {
    assertUnimplementedTimeframe,
    getDefaultDateRangeFromInterval,
    TimeFrames,
} from '@lightdash/common';
import dayjs from 'dayjs';
import { type DateRangePreset } from '../hooks/useDateRangePicker';

const DATE_FORMAT = 'MMM D, YYYY';
export const formatDate = (date: Date | null): string | undefined => {
    return date ? dayjs(date).format(DATE_FORMAT) : undefined;
};

/**
 * Get the date range presets for the metric peek date picker
 * @param timeInterval - The timeframe for which to get the date range presets
 * @returns The date range presets
 */
export const getDateRangePresets = (
    timeInterval: TimeFrames,
): DateRangePreset[] => {
    const now = dayjs();
    const today = now.startOf('day');

    switch (timeInterval) {
        // Timeframe: Day
        // Presets include:
        // - Today: From 00:00 until the current time
        // - Past 7 days: 7 full days plus the current day
        // - Past 30 days: 30 full days plus the current day
        // - Past 3 months: 12 full weeks plus the current week
        // - Past 12 months: 12 full months plus the current month
        // - Past 5 years: 5 full years plus the current year
        // - All time: No filter applied
        case TimeFrames.DAY:
            return [
                {
                    label: 'Today',
                    controlLabel: 'Today',
                    getValue: () => [today.toDate(), now.toDate()],
                },
                {
                    label: 'Past 7 days',
                    controlLabel: '7D',
                    getValue: () => [
                        today.subtract(7, 'day').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 30 days',
                    controlLabel: '30D',
                    getValue: () =>
                        getDefaultDateRangeFromInterval(timeInterval),
                },
                {
                    label: 'Past 3 months',
                    controlLabel: '3M',
                    getValue: () => [
                        today.subtract(12, 'week').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 12 months',
                    controlLabel: '12M',
                    getValue: () => [
                        today.subtract(12, 'month').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 5 years',
                    controlLabel: '5Y',
                    getValue: () => [
                        today.subtract(5, 'year').toDate(),
                        now.toDate(),
                    ],
                },
            ];

        // Timeframe: Week
        // Presets include:
        // - This week: From the start of the current week until now
        // - Past 1 week: 1 full week plus the current week
        // - Past 4 weeks: 4 full weeks plus the current week
        // - Past 3 months: 12 full weeks plus the current week
        // - Past 12 months: 12 full months plus the current month
        // - Past 5 years: 5 full years plus the current year
        // - All time: No filter applied
        case TimeFrames.WEEK:
            return [
                {
                    label: 'This week',
                    controlLabel: 'This week',
                    getValue: () => [
                        today.startOf('week').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 1 week',
                    controlLabel: '1W',
                    getValue: () => [
                        today.subtract(1, 'week').startOf('week').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 4 weeks',
                    controlLabel: '4W',
                    getValue: () => [
                        today.subtract(4, 'week').startOf('week').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 3 months',
                    controlLabel: '3M',
                    getValue: () =>
                        getDefaultDateRangeFromInterval(timeInterval),
                },
                {
                    label: 'Past 12 months',
                    controlLabel: '12M',
                    getValue: () => [
                        today.subtract(12, 'month').startOf('month').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 5 years',
                    controlLabel: '5Y',
                    getValue: () => [
                        today.subtract(5, 'year').startOf('year').toDate(),
                        now.toDate(),
                    ],
                },
            ];

        // Timeframe: Month
        // Presets include:
        // - This month: From the start of the current month until now
        // - Past 3 months: 3 full months plus the current month
        // - Past 6 months: 6 full months plus the current month
        // - Past 12 months: 12 full months plus the current month
        // - Past 5 years: 5 full years plus the current year
        // - All time: No filter applied
        case TimeFrames.MONTH:
            return [
                {
                    label: 'This month',
                    controlLabel: 'This month',
                    getValue: () => [
                        today.startOf('month').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 3 months',
                    controlLabel: '3M',
                    getValue: () => [
                        today.subtract(3, 'month').startOf('month').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 6 months',
                    controlLabel: '6M',
                    getValue: () => [
                        today.subtract(6, 'month').startOf('month').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 12 months',
                    controlLabel: '12M',
                    getValue: () =>
                        getDefaultDateRangeFromInterval(timeInterval),
                },
                {
                    label: 'Past 5 years',
                    controlLabel: '5Y',
                    getValue: () => [
                        today.subtract(5, 'year').startOf('year').toDate(),
                        now.toDate(),
                    ],
                },
            ];

        // Timeframe: Year
        // Presets include:
        // - This year: From the start of the current year until now
        // - Past 1 year: 1 full year plus the current year
        // - Past 5 years: 5 full years plus the current year
        // - All time: No filter applied
        case TimeFrames.YEAR:
            return [
                {
                    label: 'This year',
                    controlLabel: 'This year',
                    getValue: () => [
                        today.startOf('year').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 1 year',
                    controlLabel: '1Y',
                    getValue: () => [
                        today.subtract(1, 'year').startOf('year').toDate(),
                        now.toDate(),
                    ],
                },
                {
                    label: 'Past 5 years',
                    controlLabel: '5Y',
                    getValue: () =>
                        getDefaultDateRangeFromInterval(timeInterval),
                },
            ];

        default:
            return assertUnimplementedTimeframe(timeInterval);
    }
};

/**
 * Checks if two date ranges are equal, handling null values
 */
const areDateRangesEqual = (
    range1: [Date | null, Date | null],
    range2: [Date | null, Date | null],
    timeInterval: TimeFrames,
): boolean => {
    if (
        range1[0] === null &&
        range2[0] === null &&
        range1[1] === null &&
        range2[1] === null
    ) {
        return true;
    }

    let isSameTimeInterval: dayjs.OpUnitType | undefined;
    switch (timeInterval) {
        case TimeFrames.DAY:
            isSameTimeInterval = 'day';
            break;
        case TimeFrames.WEEK:
            isSameTimeInterval = 'week';
            break;
        case TimeFrames.MONTH:
            isSameTimeInterval = 'month';
            break;
        case TimeFrames.YEAR:
            isSameTimeInterval = 'year';
            break;
        default:
            isSameTimeInterval = undefined;
    }

    return (
        dayjs(range1[0]).isSame(dayjs(range2[0]), isSameTimeInterval) &&
        dayjs(range1[1]).isSame(dayjs(range2[1]), isSameTimeInterval)
    );
};

/**
 * Gets the matching preset control label for a given date range
 */
export const getMatchingPresetLabel = (
    dateRange: [Date | null, Date | null],
    timeInterval: TimeFrames,
): string | undefined => {
    const presets = getDateRangePresets(timeInterval);
    const matchingPreset = presets.find((preset) => {
        return areDateRangesEqual(preset.getValue(), dateRange, timeInterval);
    });
    return matchingPreset?.controlLabel;
};
