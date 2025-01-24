
import React from 'react';
import styles from './Legend.module.css';

const Legend = ({ bins, colors } : any) => {
    console.log('Legend:')
    console.log(bins)
    console.log(colors)
    return (
    <div>
        <br></br>
        <div className={styles.legend}>
            {bins.map((bin : any, index : number) => {
            return (
                <div className={styles.classItem}>
                    <span className={styles.classSymbol} style={{ backgroundColor: colors[index] }}></span>
                    <span className={styles.classLabel}>{bin.startValue} - {bin.endValue}</span>
                </div>
                )
            })}
        </div>
    </div>
    )
}

export default Legend;