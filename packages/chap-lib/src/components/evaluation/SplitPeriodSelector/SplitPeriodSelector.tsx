import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { getPeriodNameFromId } from '../../../utils/Time'

interface SplitPeriodSelectorProps {
    splitPeriods: string[]
    setSelectedSplitPeriod: (splitPeriod: string) => void
    selectedSplitPeriod: string
}

const SplitPeriodSelector = ({
    splitPeriods,
    setSelectedSplitPeriod,
    selectedSplitPeriod,
}: SplitPeriodSelectorProps) => {
    if (!splitPeriods.includes(selectedSplitPeriod)) {
        return <></>
    }

    return (
        <div>
            <div>
                <SingleSelectField
                    selected={selectedSplitPeriod}
                    onChange={(e) => setSelectedSplitPeriod(e.selected)}
                >
                    {splitPeriods.map((splitPeriod, i) => (
                        <SingleSelectOption
                            key={i}
                            label={getPeriodNameFromId(splitPeriod)}
                            value={splitPeriod}
                        />
                    ))}
                </SingleSelectField>
            </div>
        </div>
    )
}

export default SplitPeriodSelector
