import { Chip, IconQuestion24, Popover } from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import styles from './styles/PredictEvaluateHelp.module.css'

const PredictEvaluateHelp = () => {
    const divRef = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)

    const open = Boolean(anchorEl)

    return (
        <div className={styles.helpContainer}>
            <div ref={divRef}>
                <Chip
                    onClick={() => setAnchorEl(divRef.current)}
                    icon={<IconQuestion24 />}
                >
                    Help
                </Chip>
            </div>
            {open && (
                <Popover
                    //elevation="0px 0px 1px rgba(33,41,52,0.1), 0px 4px 6px -1px rgba(33,41,52,0.1), 0px 2px 4px -1px rgba(33,41,52,0.06)"
                    maxWidth={360}
                    placement="top"
                    onClickOutside={() => setAnchorEl(null)}
                    reference={divRef}
                >
                    <div className={styles.popover}>
                        <h3>Predict</h3>
                        <p>Predict means to...</p>
                        <h3>Evaluate</h3>
                        <p>Evalaute the models for your data</p>
                    </div>
                </Popover>
            )}
        </div>
    )
}

export default PredictEvaluateHelp
