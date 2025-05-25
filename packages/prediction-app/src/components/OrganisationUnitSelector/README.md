# Organisation Unit Selector

A generic, self-contained React component for selecting DHIS2 organisation units. This component can be copied to any DHIS2 app and used independently. **Now fully converted to TypeScript!**

## Dependencies

This component requires the following dependencies in your project:

```json
{
  "@dhis2/app-runtime": "^3.x.x",
  "@dhis2/ui": "^9.x.x",
  "classnames": "^2.x.x",
  "react": "^18.x.x"
}
```

Note: PropTypes are no longer needed as the component now uses TypeScript for type safety.

## Installation

1. Copy the entire `OrganisationUnitSelector` folder to your `src` directory
2. Ensure you have all the required dependencies installed
3. Import and use the component

## Usage

```tsx
import React, { useState } from 'react'
import { 
    OrganisationUnitSelector, 
    type OrganisationUnit, 
    type SelectionChangeEvent 
} from './OrganisationUnitSelector'
// If you have i18n available
import i18n from '../locales'

function MyComponent() {
    const [selected, setSelected] = useState<OrganisationUnit[]>([])
    const [roots] = useState<string[]>(['O6uvpzGd5pu']) // Replace with your org unit root IDs

    const handleSelect = ({ items }: SelectionChangeEvent) => {
        setSelected(items)
        // Handle the selection in your app
        console.log('Selected org units:', items)
    }

    return (
        <OrganisationUnitSelector
            roots={roots}
            selected={selected}
            onSelect={handleSelect}
            i18n={i18n} // Optional: pass your i18n instance
            displayNameProp="displayName" // Optional: 'displayName' | 'name' | 'shortName'
            hideGroupSelect={false} // Optional: hide group selection
            hideLevelSelect={false} // Optional: hide level selection
            hideUserOrgUnits={false} // Optional: hide user org unit checkboxes
            warning="" // Optional: warning message to display
        />
    )
}
```

## TypeScript Types

The component exports the following TypeScript interfaces:

```tsx
interface OrganisationUnit {
    id: string
    name?: string
    displayName?: string
    path?: string
}

interface SelectionChangeEvent {
    dimensionId: string
    items: OrganisationUnit[]
}

interface I18nInstance {
    t: (key: string, options?: Record<string, any>) => string
    language?: string
}

interface OrganisationUnitSelectorProps {
    roots: string[]
    selected: OrganisationUnit[]
    onSelect: (event: SelectionChangeEvent) => void
    hideGroupSelect?: boolean
    hideLevelSelect?: boolean
    hideUserOrgUnits?: boolean
    warning?: string
    displayNameProp?: 'displayName' | 'name' | 'shortName'
    i18n?: I18nInstance
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `roots` | `string[]` | - | **Required.** Array of organisation unit IDs to use as roots for the tree |
| `selected` | `OrganisationUnit[]` | - | **Required.** Array of selected organisation units |
| `onSelect` | `(event: SelectionChangeEvent) => void` | - | **Required.** Callback function called when selection changes |
| `i18n` | `I18nInstance` | - | Optional. i18n instance for translations. If not provided, English fallbacks are used |
| `displayNameProp` | `'displayName' \| 'name' \| 'shortName'` | `'displayName'` | Property to use for display names |
| `hideGroupSelect` | `boolean` | `false` | Hide the organisation unit group selector |
| `hideLevelSelect` | `boolean` | `false` | Hide the organisation unit level selector |
| `hideUserOrgUnits` | `boolean` | `false` | Hide the user organisation unit checkboxes |
| `warning` | `string` | - | Warning message to display instead of the summary |

## Selection Object Format

The `selected` prop and `onSelect` callback use the following format:

```typescript
{
    dimensionId: 'ou', // Always 'ou' for organisation units
    items: [
        {
            id: 'abc123', // Organisation unit ID
            name: 'District Hospital', // Display name
            path: '/ImspTQPwCqd/O6uvpzGd5pu/abc123' // Optional: Full path for org units
        },
        {
            id: 'LEVEL-2', // Level selection
            name: 'District' // Level display name
        },
        {
            id: 'OU_GROUP-xyz789', // Group selection
            name: 'Hospitals' // Group display name
        },
        {
            id: 'USER_ORGUNIT', // User org unit
            displayName: 'User organisation unit'
        }
        // ... more items
    ]
}
```

## Special Organisation Unit Types

The component supports these special organisation unit types:

- `USER_ORGUNIT` - Current user's organisation unit
- `USER_ORGUNIT_CHILDREN` - Children of user's organisation unit
- `USER_ORGUNIT_GRANDCHILDREN` - Grandchildren of user's organisation unit
- `LEVEL-{id}` - Organisation units at a specific level
- `OU_GROUP-{id}` - Organisation units in a specific group

## Internationalization

The component supports internationalization through the `i18n` prop. If you don't provide an i18n instance, English fallback text will be used. The component expects the i18n instance to have a `t(key, options)` method compatible with react-i18next.

## Styling

The component uses CSS modules for styling and imports colors and spacers from `@dhis2/ui`. All styles are self-contained within the component in the `styles/OrganisationUnitSelector.module.css` file.

## API Functions

The component also exports API functions that you can use independently:

```tsx
import {
    apiFetchOrganisationUnitLevels,
    apiFetchOrganisationUnitGroups,
    apiFetchOrganisationUnitRoots
} from './OrganisationUnitSelector'

// These functions require a dataEngine instance from @dhis2/app-runtime
```

## Helper Functions

Utility functions are also exported:

```tsx
import {
    ouIdHelper,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
    DIMENSION_ID_ORGUNIT
} from './OrganisationUnitSelector'

// Check if an ID has a level prefix
ouIdHelper.hasLevelPrefix('LEVEL-2') // true

// Add prefixes to IDs
ouIdHelper.addLevelPrefix('2') // 'LEVEL-2'
ouIdHelper.addGroupPrefix('abc123') // 'OU_GROUP-abc123'
```

## Example with Minimal Setup

```tsx
import React, { useState } from 'react'
import { 
    OrganisationUnitSelector, 
    type OrganisationUnit 
} from './OrganisationUnitSelector'

function SimpleExample() {
    const [selected, setSelected] = useState<OrganisationUnit[]>([])

    return (
        <div style={{ width: '400px', height: '600px' }}>
            <OrganisationUnitSelector
                roots={['ImspTQPwCqd']} // Sierra Leone root org unit
                selected={selected}
                onSelect={({ items }) => setSelected(items)}
            />
        </div>
    )
}
```

This component is completely self-contained and can be used in any DHIS2 app that has the required dependencies. The TypeScript conversion provides better type safety and developer experience. 