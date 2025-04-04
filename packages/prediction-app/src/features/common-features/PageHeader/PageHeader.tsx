import React from 'react'
import styles from './PageHeader.module.css'
import { Button, IconAdd16 } from '@dhis2/ui'

interface PageHeaderProps {
    pageTitle: string
    setDrawerOpen?: (isOpen: boolean) => void
    setDrawerOpenText?: string
}

const PageHeader = ({
    pageTitle,
    setDrawerOpen,
    setDrawerOpenText,
}: PageHeaderProps) => {
    return (
        <div className={styles.predictionHeader}>
            <h2>{pageTitle}</h2>
            {setDrawerOpen && setDrawerOpenText && (
                <Button
                    onClick={() => setDrawerOpen(true)}
                    icon={<IconAdd16 />}
                    primary
                >
                    {setDrawerOpenText}
                </Button>
            )}
        </div>
    )
}

export default PageHeader
