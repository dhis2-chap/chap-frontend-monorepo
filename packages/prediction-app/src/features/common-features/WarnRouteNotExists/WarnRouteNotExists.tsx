import { useConfig } from '@dhis2/app-runtime'
import React from 'react'

import { NoticeBox } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import style from './WarnRouteNotExists.module.css'
import useGetRoute from '../../../hooks/useGetRoute'
import { maxWidth } from '../../navbar/NavBar'

const WarnRouteNotExists = () => {
    const { loading, route, error } = useGetRoute()

    if (!route && !loading) {
        return (
            <div className={style.warningMargin} style={{ maxWidth: maxWidth }}>
                <div className={style.warningMarginInner}>
                    <NoticeBox warning title="Missing route">
                        No route for CHAP was found. Functionality is limited.{' '}
                        <Link to="/settings">Go to settings ➔</Link>
                    </NoticeBox>
                </div>
            </div>
        )
    }

    return <></>
}

export default WarnRouteNotExists
