import React, { useState } from 'react'
import {
    Button,
    InputField,
    Label,
    SingleSelect,
    SingleSelectOption,
    Checkbox,
    Chip,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Control, Controller, useWatch, UseFormSetValue } from 'react-hook-form'
import { ModelTemplateRead } from '@dhis2-chap/chap-lib'
import styles from './UserOptionsFields.module.css'

export interface UserOptionConfig {
    type: string
    title?: string
    default?: any
    enum?: string[]
    items?: {
        type: string
    }
    anyOf?: Array<{
        type: string
    }>
}

interface UserOptionsFieldsProps {
    control: Control<any>
    setValue: UseFormSetValue<any>
    currentTemplate: ModelTemplateRead | undefined
    disabled?: boolean
}

// Helper function to get default value for a user option
const getDefaultValue = (option: UserOptionConfig): any => {
    if (option.default !== undefined) {
        return option.default
    }
    if (option.type === 'integer' || option.type === 'number') return 0
    if (option.type === 'boolean') return false
    if (option.type === 'array') return []
    if (option.type === 'string') return ''
    if (option.anyOf) {
        // Handle nullable types - default to null if null is an option
        const hasNull = option.anyOf.some(type => type.type === 'null')
        if (hasNull) return null
        // Otherwise use the first non-null type's default
        const firstType = option.anyOf.find(type => type.type !== 'null')
        if (firstType?.type === 'integer' || firstType?.type === 'number') return 0
        if (firstType?.type === 'boolean') return false
        if (firstType?.type === 'string') return ''
    }
    return null
}

// Helper function to convert string input to appropriate type
const convertValue = (value: string, option: UserOptionConfig): any => {
    if (option.type === 'integer') {
        const parsed = parseInt(value, 10)
        return isNaN(parsed) ? 0 : parsed
    }
    if (option.type === 'number') {
        const parsed = parseFloat(value)
        return isNaN(parsed) ? 0 : parsed
    }
    if (option.type === 'boolean') {
        return value === 'true'
    }
    if (option.anyOf) {
        // Handle nullable types
        if (value === '' || value === null || value === 'null') return null
        const integerType = option.anyOf.find(type => type.type === 'integer')
        const numberType = option.anyOf.find(type => type.type === 'number')
        if (integerType) {
            const parsed = parseInt(value, 10)
            return isNaN(parsed) ? null : parsed
        }
        if (numberType) {
            const parsed = parseFloat(value)
            return isNaN(parsed) ? null : parsed
        }
    }
    return value
}

export const UserOptionsFields: React.FC<UserOptionsFieldsProps> = ({
    control,
    setValue,
    currentTemplate,
    disabled = false
}) => {
    const [arrayInputs, setArrayInputs] = useState<Record<string, string>>({})

    const userOptions = currentTemplate?.userOptions || {}

    // Watch for user options changes
    const watchedUserOptions = useWatch({
        control,
        name: 'userOptions'
    })

    // Update default user options when template changes
    React.useEffect(() => {
        if (currentTemplate?.userOptions) {
            const defaults: Record<string, any> = {}
            Object.entries(currentTemplate.userOptions).forEach(([key, option]) => {
                defaults[key] = getDefaultValue(option as UserOptionConfig)
            })
            setValue('userOptions', defaults)
        } else {
            setValue('userOptions', {})
        }
    }, [currentTemplate, setValue])

    const renderArrayField = (optionKey: string, optionConfig: UserOptionConfig) => {
        const currentValue = watchedUserOptions?.[optionKey] as string[] || []
        const newItem = arrayInputs[optionKey] || ''

        const handleAddItem = () => {
            if (newItem.trim() && !currentValue.includes(newItem.trim())) {
                const updatedArray = [...currentValue, newItem.trim()]
                setValue(`userOptions.${optionKey}`, updatedArray)
                setArrayInputs(prev => ({ ...prev, [optionKey]: '' }))
            }
        }

        const handleRemoveItem = (index: number) => {
            const updatedArray = currentValue.filter((_, i) => i !== index)
            setValue(`userOptions.${optionKey}`, updatedArray)
        }

        const handleInputChange = (value: string) => {
            setArrayInputs(prev => ({ ...prev, [optionKey]: value }))
        }

        return (
            <div key={optionKey} className={styles.formField}>
                <Label>{optionConfig.title || optionKey}</Label>
                <div className={styles.arrayField}>
                    <div className={styles.arrayInput}>
                        <InputField
                            value={newItem}
                            placeholder={i18n.t('Enter item')}
                            onChange={({ value }) => handleInputChange(value || '')}
                            disabled={disabled}
                        />
                        <Button
                            onClick={handleAddItem}
                            disabled={!newItem.trim() || disabled}
                            small
                        >
                            {i18n.t('Add')}
                        </Button>
                    </div>
                    <div className={styles.arrayItems}>
                        {currentValue.map((item, index) => (
                            <Chip
                                key={index}
                                onRemove={() => handleRemoveItem(index)}
                            >
                                {item}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const renderUserOption = (optionKey: string, optionConfig: UserOptionConfig) => {
        const { type, title, enum: enumValues, anyOf } = optionConfig
        const label = title || optionKey

        // Handle array types
        if (type === 'array') {
            return renderArrayField(optionKey, optionConfig)
        }

        // Handle enum types (select dropdown)
        if (enumValues && enumValues.length > 0) {
            return (
                <div key={optionKey} className={styles.formField}>
                    <Label>{label}</Label>
                    <Controller
                        name={`userOptions.${optionKey}` as any}
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                selected={field.value?.toString() || ''}
                                disabled={disabled}
                                onChange={({ selected }) => field.onChange(selected)}
                            >
                                {enumValues.map((value) => (
                                    <SingleSelectOption
                                        key={value}
                                        label={value}
                                        value={value}
                                    />
                                ))}
                            </SingleSelect>
                        )}
                    />
                </div>
            )
        }

        // Handle boolean types
        if (type === 'boolean') {
            return (
                <div key={optionKey} className={styles.formField}>
                    <Controller
                        name={`userOptions.${optionKey}` as any}
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                label={label}
                                checked={field.value || false}
                                disabled={disabled}
                                onChange={({ checked }) => field.onChange(checked)}
                            />
                        )}
                    />
                </div>
            )
        }

        // Handle nullable types (anyOf with null)
        if (anyOf) {
            const hasNull = anyOf.some(typeOption => typeOption.type === 'null')
            const nonNullType = anyOf.find(typeOption => typeOption.type !== 'null')

            if (hasNull && nonNullType) {
                const inputType = nonNullType.type === 'integer' || nonNullType.type === 'number' ? 'number' : 'text'
                const step = nonNullType.type === 'number' ? 'any' : nonNullType.type === 'integer' ? '1' : undefined

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
                                        const convertedValue = value === '' ? null : convertValue(value || '', optionConfig)
                                        field.onChange(convertedValue)
                                    }}
                                />
                            )}
                        />
                    </div>
                )
            }
        }

        // Handle regular types (string, number, integer)
        const inputType = type === 'integer' || type === 'number' ? 'number' : 'text'
        const step = type === 'number' ? 'any' : type === 'integer' ? '1' : undefined

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
                                const convertedValue = convertValue(value || '', optionConfig)
                                field.onChange(convertedValue)
                            }}
                        />
                    )}
                />
            </div>
        )
    }

    if (Object.keys(userOptions).length === 0) {
        return null
    }

    return (
        <div className={styles.formField}>
            <Label>{i18n.t('Model Parameters')}</Label>
            <div className={styles.userOptionsContainer}>
                {Object.entries(userOptions).map(([key, option]) =>
                    renderUserOption(key, option as UserOptionConfig)
                )}
            </div>
        </div>
    )
}

export default UserOptionsFields

// Export helper functions for potential reuse
export { getDefaultValue, convertValue } 