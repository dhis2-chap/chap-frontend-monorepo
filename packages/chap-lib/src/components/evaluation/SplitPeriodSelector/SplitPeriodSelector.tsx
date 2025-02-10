import {
    Checkbox,
    SingleSelect,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React from 'react'

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
                            label={splitPeriod}
                            value={splitPeriod}
                        />
                    ))}
                </SingleSelectField>
            </div>
        </div>
    )
}

export default SplitPeriodSelector
