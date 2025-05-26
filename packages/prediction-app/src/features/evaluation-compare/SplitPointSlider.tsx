import React from 'react'
import css from './SplitPointSlider.module.css'
import { getPeriodNameFromId } from '../utils/Time'
import i18n from '@dhis2/d2-i18n'
import { Label } from '@dhis2/ui'

type SplitPeriodSlider = {
    splitPeriods: string[]
    selectedSplitPeriod: string
    onChange: (selectedPoint: string) => void
}

const SplitPeriodSlider: React.FC<SplitPeriodSlider> = ({
    splitPeriods: splitPoints,
    selectedSplitPeriod: selectedSplitPoint,
    onChange,
}) => {
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(event.target.value, 10)
        onChange(splitPoints[index])
    }

    const middleSplitIndex = Math.floor(splitPoints.length / 2)
    const splitPeriodLabels = [
        splitPoints[0],
        splitPoints[middleSplitIndex],
        splitPoints[splitPoints.length - 1],
    ]
        .filter((sp, i, arr) => arr.indexOf(sp) === i)
        .map((point) => getPeriodNameFromId(point))

    return (
        <div className={css.sliderContainer}>
            <div className={css.selectedLabelContainer}>
                <Label htmlFor="splitPeriodSlider">
                    {i18n.t('Split period')}
                </Label>
                <span className={css.selectedLabel}>
                    {getPeriodNameFromId(selectedSplitPoint)}
                </span>
            </div>
            <input
                name="splitPeriodSlider"
                type="range"
                min="0"
                max={splitPoints.length - 1}
                value={splitPoints.indexOf(selectedSplitPoint)}
                onChange={handleSliderChange}
                className={css.slider}
            />
            <div className={css.labelsContainer}>
                {splitPeriodLabels.map((point) => (
                    <span key={point} className={css.label}>
                        {point}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default SplitPeriodSlider
