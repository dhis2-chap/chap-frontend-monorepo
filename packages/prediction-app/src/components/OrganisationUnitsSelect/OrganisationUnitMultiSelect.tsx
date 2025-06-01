import React, { useMemo, useState } from 'react'
import {
    MultiSelect,
    MultiSelectOption,
    Help,
    MultiSelectProps,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import css from './OrganisationUnitMultiSelect.module.css'

const DEFAULT_MAX_SELECTED = 10

type DisplayableOrgUnit = {
    id: string
    displayName: string
}
type OrganisationUnitMultiSelectProps = Omit<
    MultiSelectProps,
    'onChange' | 'onBlur'
> & {
    available: DisplayableOrgUnit[]
    selected: string[]
    onSelect: (payload: { selected: string[] }) => void
    updateOnBlur?: boolean
    maxSelections?: number
}
const OrganisationUnitMultiSelect = ({
    available,
    selected,
    onSelect,
    maxSelections = DEFAULT_MAX_SELECTED,
    ...multiSelectProps
}: OrganisationUnitMultiSelectProps) => {
    // we want to batch updates to prevent fetching data based on selected orgunits
    // before the user is done selecting
    // so keep a pending state and only call onSelect on blur
    // null when not pending
    const [pendingSelectedOrgUnits, setPendingSelectedOrgUnits] = useState<
        string[] | null
    >(null)

    const resolvedSelected =
        pendingSelectedOrgUnits !== null ? pendingSelectedOrgUnits : selected

    // Multiselect will crash if selected contains items that are not in available
    // this can happen when loading, thus we add the selected items to the available list
    const { orgUnits, selectedOrgUnitIds } = useMemo(() => {
        const orgUnitsMap = new Map(available.map((o) => [o.id, o]))
        const selectedSet = new Set(resolvedSelected)
        resolvedSelected.forEach((s) => {
            if (!orgUnitsMap.get(s)) {
                orgUnitsMap.set(s, {
                    id: s,
                    displayName: s,
                })
            }
        })

        const orgUnits = Array.from(orgUnitsMap.values())
        const selectedOrgUnitIds = orgUnits.flatMap((ou) =>
            selectedSet.has(ou.id) ? [ou.id] : []
        )
        return {
            orgUnits,
            // use these IDs for the selected prop, so we use ordering from available
            selectedOrgUnitIds: selectedOrgUnitIds,
        }
    }, [available, resolvedSelected])

    return (
        <MultiSelect
            prefix={i18n.t('Organisation Units')}
            selected={selectedOrgUnitIds}
            disabled={available.length < 1}
            filterable
            filterPlaceholder={i18n.t('Search organisation units')}
            clearable={true}
            clearText={i18n.t('Clear all organisation units')}
            onChange={({ selected }, event) => {
                const isChipDeletion = event.type === 'click'
                if (isChipDeletion) {
                    // dont batch updates on chip deletion
                    onSelect({ selected })
                } else {
                    setPendingSelectedOrgUnits(selected.slice(0, maxSelections))
                }
            }}
            onBlur={() => {
                if (pendingSelectedOrgUnits != null) {
                    onSelect({
                        selected: pendingSelectedOrgUnits ?? [],
                    })
                    setPendingSelectedOrgUnits(null)
                }
            }}
            inputMaxHeight="26px"
            {...multiSelectProps}
        >
            {selected.length >= maxSelections && (
                <Help className={css.help} warning>
                    {i18n.t(
                        'You cannot select more than {{max}} organisation units at a time',
                        {
                            max: maxSelections,
                        }
                    )}
                </Help>
            )}
            {orgUnits.map((ou) => (
                <MultiSelectOption
                    key={ou.id}
                    label={ou.displayName}
                    value={ou.id}
                />
            ))}
        </MultiSelect>
    )
}

export default OrganisationUnitMultiSelect
