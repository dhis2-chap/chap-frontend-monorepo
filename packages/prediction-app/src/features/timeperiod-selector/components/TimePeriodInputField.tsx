import React, { useRef } from "react";
import styles from "./MonthPicker.module.css";
import { supportsWeekInput } from "../../../utils/browserSupport";
import { dateToWeekFormat } from "../../../utils/dateToWeek";
import i18n from '@dhis2/d2-i18n';

interface TimePeriodInputFieldProps {
  periodeType : "week" | "month" | ""
  label: string
  name: string
  onChange: (value: string) => void
}

const getInputType = (periodeType: string): string => {
  if (periodeType === 'week') {
    return supportsWeekInput() ? 'week' : 'date';
  }
  return periodeType;
};

const TimePeriodInputField = ({ label, name, onChange, periodeType } : TimePeriodInputFieldProps) => {
  const inputEl = useRef(null);

  return (
    <div className={styles.datePicker} style={{opacity: periodeType === "" ? 0.6 : 1}}>
      <label className={styles.label}>{label}</label>
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.inputDiv}>
            <input
              disabled={periodeType === ""}
              className={styles.input}
              ref={inputEl}
              type={getInputType(periodeType)}
              name={name}
              onChange={(e) => {
                const value = periodeType === 'week' && !supportsWeekInput()
                  ? dateToWeekFormat(e.target.value)
                  : e.target.value;
                onChange(value);
              }}
            />
          </div>
          {periodeType === 'week' && !supportsWeekInput() && (
            <p className={styles.helpText}>
              {i18n.t('Select any date - we will use the week containing that date')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimePeriodInputField;
