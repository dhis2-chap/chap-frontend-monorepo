import React from 'react'
import css from './SplitPeriodSlider.module.css'
import { getPeriodNameFromId } from '../utils/Time'
import i18n from '@dhis2/d2-i18n'
import { Label } from '@dhis2/ui'
import { Range } from 'react-range'
import { clamp } from '../utils/clamp'

type SplitPeriodSlider = {
    splitPeriods: string[]
    selectedSplitPeriod: string
    onChange: (selectedPoint: string) => void
    periods?: string[]
    splitPeriodLength?: number
}

export const SplitPeriodSlider: React.FC<SplitPeriodSlider> = ({
    splitPeriods,
    selectedSplitPeriod: selectedSplitPoint,
    onChange,
    periods = [],
    splitPeriodLength = 3,
}) => {
    const lastSplitPeriod = splitPeriods[splitPeriods.length - 1]

    const handleChange = (values: number[]) => {
        const splitPeriodIndex = clamp(values[0], 0, splitPeriods.length - 1)
        const value = splitPeriods[splitPeriodIndex] ?? lastSplitPeriod
        return onChange(value)
    }

    const lastSplitPeriodInPeriodsIndex = periods.findIndex(
        (period) => period === lastSplitPeriod
    )

    // add last periods to be able to the end of the periods
    // note that this portion cannot be selected, and will select the last valid split period
    const withExtraPeriods = splitPeriods.concat(
        periods.slice(
            lastSplitPeriodInPeriodsIndex + 1,
            lastSplitPeriodInPeriodsIndex + splitPeriodLength
        )
    )

    const middlePeriodIndex = Math.floor(splitPeriods.length / 2)
    const splitPeriodLabels = [
        withExtraPeriods[0],
        withExtraPeriods[middlePeriodIndex],
        withExtraPeriods[withExtraPeriods.length - 1],
    ]
        .filter((sp, i, arr) => arr.indexOf(sp) === i)
        .map((point) => getPeriodNameFromId(point))

    const splitPeriodIndex = withExtraPeriods.indexOf(selectedSplitPoint)

    const getTrackBackground = () => {
        const total = withExtraPeriods.length - 1
        const splitPeriodStart =
            splitPeriodIndex * (100 / (withExtraPeriods.length - 1))
        const splitPeriodEnd =
            (splitPeriodIndex + splitPeriodLength) * (100 / total)
        return `linear-gradient(
            to right,
            var(--colors-grey300) ${splitPeriodStart}%,
            var(--colors-blue300) ${splitPeriodStart}%,
            var(--colors-blue300) ${splitPeriodEnd}%,
            var(--colors-grey300) ${splitPeriodEnd}%
            
        )`
    }

    return (
        <div className={css.wrapper}>
            <div className={css.selectedLabelContainer}>
                <Label htmlFor="splitPeriodSlider">
                    {i18n.t('Split period')}
                </Label>
                <span className={css.selectedLabel}>
                    {`${getPeriodNameFromId(
                        selectedSplitPoint
                    )} - ${getPeriodNameFromId(
                        withExtraPeriods[splitPeriodIndex + 2]
                    )}`}
                </span>
            </div>

            <div className={css.sliderContainer}>
                <Range
                    labelledBy="splitPeriodSlider"
                    min={0}
                    max={withExtraPeriods.length - 1}
                    values={[withExtraPeriods.indexOf(selectedSplitPoint)]}
                    renderThumb={({ props }) => (
                        <div {...props} className={css.thumb}>
                            <svg
                                width="100%"
                                height="auto"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </div>
                    )}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            key={1}
                            style={{
                                ...props.style,
                                background: getTrackBackground(),
                            }}
                            className={css.track}
                        >
                            {children}
                        </div>
                    )}
                    onChange={handleChange}
                />
                <div className={css.labelsContainer}>
                    {splitPeriodLabels.map((point) => (
                        <span key={point} className={css.label}>
                            {point}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
