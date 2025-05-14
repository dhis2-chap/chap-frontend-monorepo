import React from 'react'
import NavBar from '../features/navbar/NavBar'
import WarnAboutIncompatibleVersion from '../features/common-features/WarnAboutIncompatibleVersion/WarnAboutIncompatibleVersion'
import InfoAboutReportingBugs from '../features/common-features/InfoAboutReportingBugs/InfoAboutReportingBugs'
import { RouteValidator } from './RouteValidator'
import { useMatches } from 'react-router-dom'
import { RouteHandle } from '../App'

interface ComponentWrapperProps {
    children: React.ReactNode
    maxWidth?: string
}

export const defaultMaxWidth: string = '1400px'

const style: React.CSSProperties = {
    maxWidth: defaultMaxWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 10px',
    width: '100%',
}

const ComponentWrapper = ({
    children,
    maxWidth,
}: ComponentWrapperProps) => {
    const fullWidthRoute = useMatches().some(
        (match) => !!(match.handle as RouteHandle)?.fullWidth
    )

    return (
        <div
            style={{
                ...style,
                maxWidth: fullWidthRoute ? 'none' : maxWidth || defaultMaxWidth,
                width: '100%',
            }}
        >
            {children}
        </div>
    )
}

export default ComponentWrapper
