import { Switch, SwitchChangeHandler, SwitchProps } from '@dhis2/ui'
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import styles from '../styles/SwitchClimateSources.module.css'

interface SwitchClimateSourcesProps {
    setRenderOptionalField: Dispatch<SetStateAction<boolean | undefined>>
    renderOptionalField: boolean | undefined
}

const SwitchClimateSources = ({
    setRenderOptionalField,
    renderOptionalField,
}: SwitchClimateSourcesProps) => {
    const handleSwitch = (v: SwitchProps) => {
        setRenderOptionalField(!v.checked)
    }

    return (
        <div className={styles.switchWrapper}>
            <div>
                <div>Fetch ERA5-Land Climate Data directly in CHAP Core</div>
                {
                    <div className={styles.smallText}>
                        Using this option, CHAP Core will, based on provided
                        polygons, fetch climate data directly from ERA5-Land.
                        Using this feature requires that you have configured
                        CHAP Core with Google Earth Engine.
                    </div>
                }
            </div>
            <div>
                <Switch
                    disabled
                    checked={!renderOptionalField}
                    onChange={handleSwitch}
                />
            </div>
        </div>
    )
}

export default SwitchClimateSources
