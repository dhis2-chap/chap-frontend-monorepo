import { NoticeBox } from '@dhis2/ui'
import React, { useEffect, useRef, useState } from 'react'
import style from './WarnAboutIncompatibleVersion.module.css'
import { maxWidth } from '../../navbar/NavBar'
import {
    DefaultService,
} from '@dhis2-chap/chap-lib'
import { useConfig } from '@dhis2/app-runtime'
import { useRoute } from '../../../hooks/useRoute'

const WarnAboutIncompatibleVersion = () => {
    const { appVersion } = useConfig()
    const { route, isLoading } = useRoute();
    const prevRouteUrl = useRef<string | undefined>(undefined)

    const [isCompatible, setIsCompatible] = useState<
        | {
              compatible: boolean
              description: string
          }
        | undefined
    >(undefined)

    const getIsCompatible = async () => {
        if (!appVersion) return
        await DefaultService.isCompatibleIsCompatibleGet(appVersion?.full)
            .then((a: any) => {
                setIsCompatible(a)
            })
            .catch(() => {
                setIsCompatible({
                    compatible: false,
                    description:
                        'Not able to check if the app is compatible with the Chap Core you are using, which means you are probably using an old version of Chap Core. See https://github.com/dhis2-chap/chap-core/releases/ for information on how to update.',
                })
            })
    }

    useEffect(() => {
        if (!appVersion || isLoading) return

        // Trigger the check if the route url has changed
        if (prevRouteUrl.current !== route?.url) {
            getIsCompatible()
            prevRouteUrl.current = route?.url
        }
    }, [appVersion, route?.url])

    return (
        <>
            {isCompatible && !isCompatible?.compatible && (
                <div
                    className={style.warningMargin}
                    style={{ maxWidth: maxWidth }}
                >
                    <div className={style.warningMarginInner}>
                        <NoticeBox error title="Incompatible versions">
                            Version of the Modeling App is not compatible with
                            the backend (Chap core)
                            <br />
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
