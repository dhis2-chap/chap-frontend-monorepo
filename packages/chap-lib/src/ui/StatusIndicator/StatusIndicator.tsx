import React from 'react';
import { Pill, PillVariant } from '../Pill';
import { Ping } from '../Ping';
import styles from './StatusIndicator.module.css';

export interface StatusIndicatorProps {
    label: string;
    variant?: PillVariant;
    active?: boolean;
}

export const StatusIndicator = ({
    label,
    variant = 'default',
    active = false,
}: StatusIndicatorProps) => {
    return (
        <Pill variant={variant}>
            <div className={styles.contentWrapper}>
                <Ping
                    variant={variant}
                    active={active}
                />
                <span>{label}</span>
            </div>
        </Pill>
    );
}; 