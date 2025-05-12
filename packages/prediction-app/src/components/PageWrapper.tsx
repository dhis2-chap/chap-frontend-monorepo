import React from 'react'
import NavBar from '../features/navbar/NavBar'
import WarnAboutIncompatibleVersion from '../features/common-features/WarnAboutIncompatibleVersion/WarnAboutIncompatibleVersion'
import InfoAboutReportingBugs from '../features/common-features/InfoAboutReportingBugs/InfoAboutReportingBugs'
import { RouteValidator } from './RouteValidator'
import { CssReset } from '@dhis2/ui'

interface ComponentWrapperProps {
    component: React.JSX.Element
}

export const maxWidth: string = '1400px'

const style: React.CSSProperties = {
    maxWidth: maxWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 10px 20px 10px',
}

const ComponentWrapper = ({ component }: ComponentWrapperProps) => {
    return (
        <RouteValidator>
            <CssReset />
            <InfoAboutReportingBugs />
            <NavBar />
            <WarnAboutIncompatibleVersion />

            <div style={style}>{component}</div>
        </RouteValidator>
    )
}

export default ComponentWrapper
