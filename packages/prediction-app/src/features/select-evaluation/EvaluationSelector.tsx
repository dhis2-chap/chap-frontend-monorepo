import React from 'react'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import { BackTestRead, CrudService } from '@dhis2-chap/chap-lib'
import css from './EvaluationSelector.module.css'

interface EvaluationSelectorProps {
    onSelect: (evaluation: BackTestRead | undefined) => void
    selected?: BackTestRead | undefined
}

const EvaluationSelector: React.FC<EvaluationSelectorProps> = ({
    onSelect,
    selected,
}) => {
    const {
        data: evaluations,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['evaluations'],
        queryFn: CrudService.getBacktestsCrudBacktestsGet,
        staleTime: 60 * 5 * 1000, // Data is considered fresh for 60 seconds
    })

    if (isError) {
        console.error('Error fetching evaluations:', error)
        return <p>Error loading evaluations.</p>
    }

    return (
        <div className={css.selectorWrapper}>
            <SingleSelect
                className={css.selector}
                prefix="Evaluation"
                placeholder="Select Evaluation"
                onChange={({ selected }) =>
                    onSelect(
                        evaluations?.find(
                            (evaluation) =>
                                evaluation.id.toString() === selected
                        )
                    )
                }
                selected={selected?.id.toString() || ''}
                loading={isLoading}
                error={isError}
                clearable
                filterable
            >
                {evaluations?.map((evaluation) => (
                    <SingleSelectOption
                        key={evaluation.id}
                        value={evaluation.id.toString()}
                        label={evaluation.name ?? ''}
                    />
                ))}
            </SingleSelect>
        </div>
    )
}

export default EvaluationSelector
