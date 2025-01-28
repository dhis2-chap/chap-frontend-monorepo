import OrgUnitTree from './OrgUnitTree'
import React from 'react'

interface OrgUnitsProps {
    orgUnits: any[]
    setOrgUnits: (orgUnits: any) => void
}

const OrgUnits = ({ orgUnits, setOrgUnits }: OrgUnitsProps) => {
    const onChangeOrgUnitTree = (selected: any) => {
        if (selected.checked) {
            setOrgUnits([...orgUnits, selected])
        } else {
            setOrgUnits(orgUnits.filter((e: any) => e.path !== selected.path))
        }
    }

    return (
        <>
            <OrgUnitTree
                selectedOrgUnits={orgUnits}
                onChange={(selected: any) => {
                    onChangeOrgUnitTree(selected)
                }}
            />
        </>
    )
}

export default OrgUnits
