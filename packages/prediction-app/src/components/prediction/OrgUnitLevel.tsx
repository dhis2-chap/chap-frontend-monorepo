import i18n from '@dhis2/d2-i18n'
import { useEffect } from 'react'
import { SingleSelect, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import useOrgUnitLevels from '../../hooks/useOrgUnitLevels'
import React from 'react'
import styles from './styles/OrgUnitLevel.module.css'

interface OrgUnitLevelProps {
    orgUnitLevels: { id: string; level: number } | undefined
    onChange: (selected_level: { id: string; level: number }) => void
}

const OrgUnitLevel = ({ orgUnitLevels, onChange }: OrgUnitLevelProps) => {
    const { levels, loading, error } = useOrgUnitLevels()

    const onChangeLevel = (e: any) => {
        const newSelected = {
            id: e.selected,
            level: (levels.find((l: any) => l.id === e.selected) as any).level,
        }
        onChange(newSelected)
    }

    // Set second level as default
    useEffect(() => {
        if (levels?.length > 2 && !orgUnitLevels) {
            onChange({
                id: (levels as any)[1]?.id,
                level: (levels as any)[1].level,
            })
        }
    }, [levels, orgUnitLevels, onChange])

    return levels ? (
        <div className={styles.selectField}>
            <SingleSelectField
                label={i18n.t('Organisation unit level')}
                helpText={i18n.t('Organisation unit level to import data to')}
                tabIndex="1"
                selected={orgUnitLevels?.id}
                loading={loading}
                error={!!error}
                onChange={onChangeLevel}
            >
                {levels.map((l: any, i: any) => (
                    <SingleSelectOption
                        key={l.id}
                        value={l.id}
                        label={l.name}
                    />
                ))}
            </SingleSelectField>
        </div>
    ) : null
}

export default OrgUnitLevel
