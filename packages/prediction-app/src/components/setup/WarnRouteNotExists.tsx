import { useConfig } from '@dhis2/app-runtime'
import React from 'react'
import useGetRoute from '../../hooks/useGetRoute'
import { NoticeBox } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import style from '../styles/WarnRouteNotExists.module.css'

const WarnRouteNotExists = () => {
    const { loading, route, error } = useGetRoute()
    const config = useConfig()

    if (
        !route &&
        !loading &&
        window.location.pathname.split('/')[1] != 'route'
    ) {
        return (
            <div className={style.warningMargin}>
                <NoticeBox warning title="Missing route">
                    No route for CHAP was found. Functionality is limited.{' '}
                    <Link to="/route/create-route">Create route ➔</Link>
                </NoticeBox>
            </div>
        )
    }

    return <></>
}

export default WarnRouteNotExists
