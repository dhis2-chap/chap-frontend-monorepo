//these functions are used to get the prediction response from the server to display them in the view, add orgUnits names and so on

import { PredictionResponseExtended } from '../interfaces/Prediction'

export const getUniqePeriods = (
    values: Array<PredictionResponseExtended>
): string[] => {
    return [...new Set(values.map((v: PredictionResponseExtended) => v.period))]
}

export const getUniqeOrgUnits = (
    values: Array<PredictionResponseExtended>
): string[] => {
    return [
        ...new Set(values.map((v: PredictionResponseExtended) => v.orgUnit)),
    ]
}

export const getUniqeQuantiles = (
    values: Array<PredictionResponseExtended>
): string[] => {
    return [
        ...new Set(
            values.map((v: PredictionResponseExtended) => v.dataElement)
        ),
    ]
}

export const findOrgUnitName = (
    orgUnitId: string,
    values: Array<PredictionResponseExtended>
) => {
    return values.find(
        (ou: PredictionResponseExtended) => ou.orgUnit === orgUnitId
    )?.displayName
}

export const numberDateToString = (date: string | number): string => {
    const year = date.toString().slice(0, 4)
    const month = date.toString().slice(4, 6)

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const monthName = monthNames[parseInt(month) - 1]

    if (monthName === undefined) {
        return String(date)
    }

    return `${monthName} ${year}`
}
