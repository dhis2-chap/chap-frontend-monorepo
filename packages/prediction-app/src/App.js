import React from 'react'
import classes from './App.module.css'
import { CHAPComponent } from '@dhis2-chap/chap-lib'


const MyApp = () => (
    <div className={classes.container}>
        <CHAPComponent />
    </div>
)

export default MyApp
