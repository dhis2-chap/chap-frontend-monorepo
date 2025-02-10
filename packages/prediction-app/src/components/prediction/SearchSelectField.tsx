import { Feature } from '@dhis2-chap/chap-lib'
import { useDataEngine } from '@dhis2/app-runtime'
import { useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect, useRef, useState } from 'react'
import styles from './styles/SearchSelectField.module.css'

const dataItemQuery = (search: string) => {
    return {
        results: {
            resource: 'dataItems',
            params: {
                filter: 'displayName:ilike:' + search,
                fields: 'id,displayName,dimensionItemType',
                order: 'displayName:asc',
                page: 1,
                pageSize: 20,
            },
        },
    }
}

interface Option {
    id: string
    displayName: string
    dimensionItemType: string
}

interface SearchableDropdownProps {
    options: Option[]
}

interface SearchSelectFieldProps {
    feature: Feature
    onChangeSearchSelectField: (feature : Feature, dataItemId : string, dataItemDisplayName : string) => void
}

const SearchSelectField = ({
    feature,
    onChangeSearchSelectField,
}: SearchSelectFieldProps) => {
    const [query, setQuery] = useState<string>('')
    const engine = useDataEngine()
    const [dataItems, setDataItems] = useState<Option[]>([])

    const [isLoading, setIsLoading] = useState(false)

    const fetchDataItem = async () => {
        try {
            const response: any = await engine.query(dataItemQuery(query))
            setDataItems(response.results.dataItems)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setQuery('')
    }, [feature])

    useEffect(() => {
        if (query.length === 0) {
            setDataItems([])
            return
        }

        setIsLoading(true)

        const handler = setTimeout(() => {
            fetchDataItem()
        }, 300)

        // Cleanup function to cancel the timeout if query changes
        return () => {
            clearTimeout(handler)
        }
    }, [query])

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsDropdownOpen(true)
        const newQuery = event.target.value
        setQuery(newQuery)
    }

    const handleOptionClick = (option: Option) => {
        setQuery(option.displayName)
        onChangeSearchSelectField(feature, option.id, option.displayName)
        setIsDropdownOpen(false)
    }

    const dropdownRef = useRef<HTMLDivElement>(null)

    const capitalizeWords = (str: string) => {
        return str
            .replaceAll('_', ' ')
            .split(' ')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ')
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false)
        }
    }

    const renderList = () => {
        if (isLoading) {
            return <li className={styles.infoSearchItem}>Loading...</li>
        }
        if (dataItems.length == 0 && query.length == 0) {
            return (
                <li className={styles.infoSearchItem}>
                    Start to search by typing
                </li>
            )
        }
        if (dataItems.length == 0) {
            return <li className={styles.infoSearchItem}>No match found</li>
        }

        return (
            <>
                {dataItems.map((option) => (
                    <li
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className={styles.dropDownItem}
                    >
                        <div>{option.displayName}</div>
                        <div className={styles.rightDropDownItem}>
                            {capitalizeWords(option.dimensionItemType)}
                        </div>
                    </li>
                ))}
            </>
        )
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={dropdownRef} className={styles.searchSelectField}>
            <label className={styles.label}>
                <span>{capitalizeWords(feature.name)}</span>
            </label>

            <input
                type="search"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for indicators, Data Elements, Data Sets, Event Data Items, Program Indicators..."
                className={styles.inputField}
            />
            {isDropdownOpen && (
                <ul className={styles.dropDown}>{renderList()}</ul>
            )}
        </div>
    )
}

export default SearchSelectField
