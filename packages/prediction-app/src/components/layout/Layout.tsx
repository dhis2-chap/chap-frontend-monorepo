import cx from 'classnames'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../sidebar'
import css from './Layout.module.css'

interface BaseLayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
}

export const BaseLayout = ({ children, sidebar }: BaseLayoutProps) => {
    return (
        <div className={css.wrapper}>
            {sidebar}
            <div className={css.main}>{children}</div>
        </div>
    )
}

export const SidebarLayout = ({
    children,
    hideSidebar,
}: {
    children: React.ReactNode
    hideSidebar?: boolean
}) => {
    return (
        <BaseLayout
            sidebar={
                <Sidebar
                    hideSidebar={hideSidebar}
                    className={cx(css.sidebar, { [css.hide]: hideSidebar })}
                />
            }
        >
            {children}
        </BaseLayout>
    )
}

export const Layout = () => {
    return (
        <SidebarLayout>
            <Outlet />
        </SidebarLayout>
    )
}
