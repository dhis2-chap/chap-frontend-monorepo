import React from 'react'
import NavBar from '../features/navbar/NavBar'
import WarnRouteNotExists from '../features/common-features/WarnRouteNotExists/WarnRouteNotExists'
import WarnAboutIncompatibleVersion from '../features/common-features/WarnAboutIncompatibleVersion/WarnAboutIncompatibleVersion'
import InfoAboutReportingBugs from '../features/common-features/InfoAboutReportingBugs/InfoAboutReportingBugs'

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
        <>
            <InfoAboutReportingBugs />
            <NavBar />
            <WarnAboutIncompatibleVersion />
            <WarnRouteNotExists />

            <div style={style}>{component}</div>
        </>
    )
}

export default ComponentWrapper
