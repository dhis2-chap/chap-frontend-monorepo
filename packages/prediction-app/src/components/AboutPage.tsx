import i18n from '@dhis2/d2-i18n'
import styles from './styles/AboutPage.module.css'
import React from 'react'

const AboutPage = () => {
    return (
        <div className={styles.container}>
            <h1>{i18n.t('About this app')}</h1>
        </div>
    )
}

export default AboutPage
