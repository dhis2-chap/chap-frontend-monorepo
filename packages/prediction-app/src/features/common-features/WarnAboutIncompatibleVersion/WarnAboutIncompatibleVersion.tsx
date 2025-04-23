import { boolean, NoticeBox } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import style from './WarnAboutIncompatibleVersion.module.css'
import { maxWidth } from '../../navbar/NavBar'
import { Link } from 'react-router-dom'
import {
    ApiError,
    CompatibilityResponse,
    DefaultService,
} from '@dhis2-chap/chap-lib'
import { useConfig } from '@dhis2/app-runtime'

const WarnAboutIncompatibleVersion = () => {
    const { appVersion } = useConfig()

    const [isCompatible, setIsCompatible] = useState<
        | {
              compatible: boolean
              description: string
          }
        | undefined
    >(undefined)

    const getIsCompatible = async () => {
        await DefaultService.isCompatibleIsCompatibleGet(appVersion?.full)
            .then((a: any) => {
                setIsCompatible(a)
            })
            .catch((response: ApiError) => {})
    }

    useEffect(() => {
        if (!appVersion) return
        getIsCompatible()
    }, [appVersion])

    return (
        <>
            {isCompatible && !isCompatible?.compatible && (
                <div
                    className={style.warningMargin}
                    style={{ maxWidth: maxWidth }}
                >
                    <div className={style.warningMarginInner}>
                        <NoticeBox error title="Incompatible versions">
                            Version of the prediction app is not compatible with
                            the backend (Chap core)
                            <br />
                            <i>{isCompatible.description}</i>
                        </NoticeBox>
                    </div>
                </div>
            )}
        </>
    )
}

export default WarnAboutIncompatibleVersion
