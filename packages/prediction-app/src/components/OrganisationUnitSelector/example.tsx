import React, { useState } from 'react'
import { OrganisationUnitSelector, type OrganisationUnit, type SelectionChangeEvent, type I18nInstance } from './index'

/**
 * Example component showing how to use OrganisationUnitSelector
 * 
 * This example demonstrates:
 * - Basic usage with required props
 * - Handling selection changes
 * - Optional i18n support
 * - Different configuration options
 */

const BasicExample: React.FC = () => {
    const [selected, setSelected] = useState<OrganisationUnit[]>([])
    const [roots] = useState<string[]>(['ImspTQPwCqd']) // Sierra Leone - replace with your org unit root IDs

    const handleSelect = ({ items }: SelectionChangeEvent): void => {
        setSelected(items)
        console.log('Selected org units:', items)
    }

    return (
        <div style={{ width: '400px', height: '600px', border: '1px solid #ccc', padding: '16px' }}>
            <h3>Basic Organisation Unit Selector</h3>
            <OrganisationUnitSelector
                roots={roots}
                selected={selected}
                onSelect={handleSelect}
                displayNameProp="displayName"
            />
        </div>
    )
}

const AdvancedExample: React.FC = () => {
    const [selected, setSelected] = useState<OrganisationUnit[]>([])
    const [roots] = useState<string[]>(['ImspTQPwCqd'])
    const [showWarning, setShowWarning] = useState<boolean>(false)

    // Mock i18n object - replace with your actual i18n instance
    const mockI18n: I18nInstance = {
        t: (key: string, options?: Record<string, any>): string => {
            // Simple mock translation - in real app use your i18n library
            const translations: Record<string, string> = {
                'User organisation unit': 'User organisation unit',
                'User sub-units': 'User sub-units',
                'User sub-x2-units': 'User sub-x2-units',
                'Select a level': 'Select a level',
                'Select a group': 'Select a group',
                'Deselect all': 'Deselect all',
                'Nothing selected': 'Nothing selected',
                'Selected: {{commaSeparatedListOfOrganisationUnits}}': `Selected: ${options?.commaSeparatedListOfOrganisationUnits || ''}`,
                '{{count}} org units': options?.count === 1 ? '1 org unit' : `${options?.count} org units`,
                '{{count}} levels': options?.count === 1 ? '1 level' : `${options?.count} levels`,
                '{{count}} groups': options?.count === 1 ? '1 group' : `${options?.count} groups`,
            }
            return translations[key] || key
        }
    }

    const handleSelect = ({ items }: SelectionChangeEvent): void => {
        setSelected(items)
        console.log('Selected org units:', items)

        // Example: Show warning if more than 5 items selected
        setShowWarning(items.length > 5)
    }

    return (
        <div style={{ width: '400px', height: '600px', border: '1px solid #ccc', padding: '16px' }}>
            <h3>Advanced Organisation Unit Selector</h3>
            <div style={{ marginBottom: '16px' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={showWarning}
                        onChange={(e) => setShowWarning(e.target.checked)}
                    />
                    Show warning
                </label>
            </div>
            <OrganisationUnitSelector
                roots={roots}
                selected={selected}
                onSelect={handleSelect}
                i18n={mockI18n}
                displayNameProp="displayName"
                hideGroupSelect={false}
                hideLevelSelect={false}
                hideUserOrgUnits={false}
                warning={showWarning ? 'Too many items selected!' : undefined}
            />
        </div>
    )
}

const CustomConfigExample: React.FC = () => {
    const [selected, setSelected] = useState<OrganisationUnit[]>([])
    const [roots] = useState<string[]>(['ImspTQPwCqd'])

    const handleSelect = ({ items }: SelectionChangeEvent): void => {
        setSelected(items)
        console.log('Selected org units:', items)
    }

    return (
        <div style={{ width: '400px', height: '600px', border: '1px solid #ccc', padding: '16px' }}>
            <h3>Custom Configuration Example</h3>
            <p>This example hides group selection and user org units</p>
            <OrganisationUnitSelector
                roots={roots}
                selected={selected}
                onSelect={handleSelect}
                displayNameProp="displayName"
                hideGroupSelect={true}
                hideLevelSelect={false}
                hideUserOrgUnits={true}
            />
        </div>
    )
}

type ExampleType = 'basic' | 'advanced' | 'custom'

// Main example component that shows all variations
const OrganisationUnitSelectorExamples: React.FC = () => {
    const [activeExample, setActiveExample] = useState<ExampleType>('basic')

    const examples: Record<ExampleType, React.ReactElement> = {
        basic: <BasicExample />,
        advanced: <AdvancedExample />,
        custom: <CustomConfigExample />
    }

    const buttonStyle = (isActive: boolean) => ({
        marginRight: '10px',
        padding: '8px 16px',
        backgroundColor: isActive ? '#0d7377' : '#f0f0f0',
        color: isActive ? 'white' : 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    })

    return (
        <div style={{ padding: '20px' }}>
            <h1>Organisation Unit Selector Examples</h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveExample('basic')}
                    style={buttonStyle(activeExample === 'basic')}
                >
                    Basic Example
                </button>
                <button
                    onClick={() => setActiveExample('advanced')}
                    style={buttonStyle(activeExample === 'advanced')}
                >
                    Advanced Example
                </button>
                <button
                    onClick={() => setActiveExample('custom')}
                    style={buttonStyle(activeExample === 'custom')}
                >
                    Custom Config
                </button>
            </div>

            {examples[activeExample]}
        </div>
    )
}

export default OrganisationUnitSelectorExamples 