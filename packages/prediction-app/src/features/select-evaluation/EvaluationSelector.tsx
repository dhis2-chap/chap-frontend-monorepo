import React, { useEffect, useMemo } from 'react'
import {
    Help,
    SingleSelect,
    SingleSelectOption,
    SingleSelectProps,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import {
    AnalyticsService,
    BackTestRead,
    CrudService,
} from '@dhis2-chap/chap-lib'
import css from './EvaluationSelector.module.css'
import i18n from '@dhis2/d2-i18n'

type EvaluationSelectorProps = Omit<BaseEvaluationSelectorProps, 'available'>

export const EvaluationSelector = ({
    onSelect,
    selected,
}: EvaluationSelectorProps) => {
    const {
        data: evaluations,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['evaluations'],
        queryFn: CrudService.getBacktestsCrudBacktestsGet,
        staleTime: 60 * 5 * 1000, // Data is considered fresh for 60 seconds
    })

    const getListMessage = () => {
        if (isSuccess && evaluations?.length === 0) {
            return <Help>{i18n.t('No evaluations found.')}</Help>
        }
        if (error) {
            return (
                <Help error>
                    {(error as Error).message ?? error.toString()}
                </Help>
            )
        }
        return null
    }
    return (
        <div className={css.selectorWrapper}>
            <BaseEvaluationSelector
                available={evaluations ?? []}
                selected={selected}
                onSelect={onSelect}
                error={isError}
                loading={isLoading}
                listMessage={getListMessage()}
                placeholder={i18n.t('Select base evaluation')}
            />
        </div>
    )
}

type EvaluationCompatibleSelector = Omit<
    BaseEvaluationSelectorProps,
    'available'
> & {
    compatibleEvaluationId?: number
}

export const EvaluationCompatibleSelector = ({
    onSelect,
    selected,
    compatibleEvaluationId,
    ...singleSelectProps
}: EvaluationCompatibleSelector) => {
    const {
        data: compatibleEvaluations,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['evaluations', 'compatible', compatibleEvaluationId],
        queryFn: () => {
            if (!compatibleEvaluationId) {
                return Promise.resolve([] as BackTestRead[])
            }
            return AnalyticsService.getCompatibleBacktestsAnalyticsCompatibleBacktestsBacktestIdGet(
                compatibleEvaluationId
            )
        },
        enabled: compatibleEvaluationId != undefined,
        staleTime: 60 * 5 * 1000,
    })
    // allow inline onSelect function
    const onSelectRef = React.useRef(onSelect)
    onSelectRef.current = onSelect

    // clear selection if no longer compatible
    // eg, there's a new compatibleEvaluationId, the data is loaded and
    // the selected evaluation is not in the compatibleEvaluations
    useEffect(() => {
        if (
            compatibleEvaluationId != undefined &&
            isSuccess &&
            !compatibleEvaluations.some((e) => e.id == compatibleEvaluationId)
        ) {
            onSelectRef.current(undefined)
        }
    }, [compatibleEvaluations, compatibleEvaluationId, isSuccess])

    const getListMessage = () => {
        if (isSuccess && compatibleEvaluations?.length === 0) {
            return <Help>{i18n.t('No compatible evaluations found')}</Help>
        }
        if (error) {
            return (
                <Help error>
                    {(error as Error).message ?? error.toString()}
                </Help>
            )
        }
        return null
    }

    return (
        <div className={css.selectorWrapper}>
            <BaseEvaluationSelector
                available={compatibleEvaluations ?? []}
                selected={selected}
                onSelect={onSelect}
                disabled={compatibleEvaluationId == undefined}
                error={isError}
                loading={isLoading}
                listMessage={getListMessage()}
                {...singleSelectProps}
                placeholder={i18n.t('Select evaluation to compare with')}
            />
        </div>
    )
}

interface BaseEvaluationSelectorProps
    extends Omit<SingleSelectProps, 'selected' | 'onChange'> {
    onSelect: (evaluation: BackTestRead | undefined) => void
    selected?: BackTestRead | undefined
    available: BackTestRead[]
    listMessage?: React.ReactNode
}

const BaseEvaluationSelector = ({
    onSelect,
    selected,
    available,
    listMessage,
    ...singleSelectProps
}: BaseEvaluationSelectorProps) => {
    const { availableMap, availableList } = useMemo(() => {
        const availableMap = new Map(
            available.map(
                (evaluation) => [evaluation.id.toString(), evaluation] as const
            )
        )
        // selected crashes if selected is not in available, so always add it
        if (selected && !availableMap.has(selected.id.toString())) {
            availableMap.set(selected?.id.toString(), selected)
        }

        return {
            availableMap,
            availableList: Array.from(availableMap.values()),
        }
    }, [available, singleSelectProps.loading, selected])

    return (
        <div className={css.selectorWrapper}>
            <SingleSelect
                className={css.selector}
                // placeholder={i18n.t('Select Evaluation')}
                onChange={({ selected: newSelected }) =>
                    onSelect(availableMap.get(newSelected))
                }
                selected={selected?.id.toString() || ''}
                clearable
                filterable
                {...singleSelectProps}
                prefix={
                    /* prefix takes presedence over placeholder, however we want
                    to switch between the two based on selection */
                    selected != undefined
                        ? singleSelectProps.prefix || i18n.t('Evaluation')
                        : undefined
                }
            >
                {listMessage && (
                    <div className={css.messageWrapper}>{listMessage}</div>
                )}
                {availableList.map((evaluation) => (
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
