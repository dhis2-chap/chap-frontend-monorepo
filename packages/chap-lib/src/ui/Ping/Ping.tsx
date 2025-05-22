import React from 'react';
import cx from 'classnames';
import styles from './Ping.module.css';
import type { PillVariant } from '../Pill';

export interface PingProps {
  active?: boolean;
  variant?: PillVariant;
}

export const Ping = ({ active = false, variant = 'default' }: PingProps) => {
  return (
    <span className={styles.wrapper}>
      <span className={cx(styles.ping, styles[variant], {
        [styles.active]: active,
      })} />
      <span
        className={cx(styles.dot, styles[variant])}
      />
    </span>
  );
};
