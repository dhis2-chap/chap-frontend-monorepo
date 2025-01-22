
import React from 'react';
import styles from './Legend.module.css';

const Legend = (bins : any, colors : any) => {
    console.log(bins)
    console.log(colors)
    return (
        <div className={styles.legend}>
            This should be a legend
        </div>
    )
}

export default Legend;