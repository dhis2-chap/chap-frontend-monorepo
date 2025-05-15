import { useMemo } from 'react';

/**
 * A generic hook for filtering an array of objects based on a search term.
 * 
 * @param data The array of objects to filter
 * @param searchTerm The search term to filter by
 * @param searchFields The fields of the objects to search in
 * @returns The filtered array of objects
 */
export const useFilteredData = <T extends Record<string, any>>(
    data: T[] | undefined,
    searchTerm: string,
    searchFields: (keyof T)[]
): T[] => {
    if (!searchTerm || !data) {
        return data || [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return useMemo(() => {
        return data.filter((item) => {
            return searchFields.some((field) => {
                const value = item[field];
                
                if (value === null || value === undefined) {
                    return false;
                }
                
                return String(value).toLowerCase().includes(lowerSearchTerm);
            });
        });
    }, [data, lowerSearchTerm, searchFields]);
};
