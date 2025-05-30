import React from 'react'
import { InputField } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Control, Controller } from 'react-hook-form'
import { UserOptionConfig } from '../UserOptionsFields'
import { TypeConverter } from '../utils'
import styles from '../UserOptionsFields.module.css'

// Constants (local to this file)
const FIELD_TYPES = {
    INTEGER: 'integer',
    NUMBER: 'number',
    NULL: 'null'
} as const

interface NullableFieldProps {
    optionKey: string
    optionConfig: UserOptionConfig
    control: Control<any>
    disabled: boolean
}

export const NullableField: React.FC<NullableFieldProps> = ({
    optionKey,
    optionConfig,
    control,
    disabled
}) => {
    const label = optionConfig.title || optionKey
    const nonNullType = optionConfig.anyOf!.find(typeOption => typeOption.type !== FIELD_TYPES.NULL)

    const inputType = nonNullType?.type === FIELD_TYPES.INTEGER || nonNullType?.type === FIELD_TYPES.NUMBER ? 'number' : 'text'
    const step = nonNullType?.type === FIELD_TYPES.NUMBER ? 'any' : nonNullType?.type === FIELD_TYPES.INTEGER ? '1' : undefined

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
                        value={field.value === null ? '' : field.value?.toString() || ''}
                        disabled={disabled}
                        placeholder={i18n.t('Leave empty for null')}
                        onChange={({ value }) => {
                            const convertedValue = value === '' ? null : TypeConverter.convertInput(value || '', optionConfig)
                            field.onChange(convertedValue)
                        }}
                    />
                )}
            />
        </div>
    )
} 