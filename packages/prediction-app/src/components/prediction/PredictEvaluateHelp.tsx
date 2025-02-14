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
                    maxWidth={360}
                    placement="top"
                    onClickOutside={() => setAnchorEl(null)}
                    reference={divRef}
                >
                    <div className={styles.popover}>

                    </div>
                </Popover>
            )}
        </div>
    )
}

export default PredictEvaluateHelp
