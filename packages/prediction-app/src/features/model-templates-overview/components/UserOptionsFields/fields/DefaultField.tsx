import React from 'react'
import { InputField } from '@dhis2/ui'
import { Control, Controller } from 'react-hook-form'
import { UserOptionConfig } from '../UserOptionsFields'
import { TypeConverter } from '../utils'
import styles from '../UserOptionsFields.module.css'

// Constants (local to this file)
const FIELD_TYPES = {
    INTEGER: 'integer',
    NUMBER: 'number'
} as const

interface DefaultFieldProps {
    optionKey: string
    optionConfig: UserOptionConfig
    control: Control<any>
    disabled: boolean
}

export const DefaultField: React.FC<DefaultFieldProps> = ({
    optionKey,
    optionConfig,
    control,
    disabled
}) => {
    const { type, title } = optionConfig
    const label = title || optionKey

    const inputType = type === FIELD_TYPES.INTEGER || type === FIELD_TYPES.NUMBER ? 'number' : 'text'
    const step = type === FIELD_TYPES.NUMBER ? 'any' : type === FIELD_TYPES.INTEGER ? '1' : undefined

    return (
        <div key={optionKey} className={styles.formField}>
            <Controller
                name={`userOptions.${optionKey}` as any}
                control={control}
                render={({ field }) => (
                    <InputField
                        label={label}
                        type={inputType}
                        step={step}
                        value={field.value?.toString() || ''}
                        disabled={disabled}
                        onChange={({ value }) => {
                            const convertedValue = TypeConverter.convertInput(value || '', optionConfig)
                            field.onChange(convertedValue)
                        }}
                    />
                )}
            />
        </div>
    )
} 