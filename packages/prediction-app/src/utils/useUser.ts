import { useMemo } from "react";
import { useApiDataQuery } from "./useApiDataQuery";


type User = {
    id: string;
    displayName: string;
    username: string;
}

const defaultFields = 'id,displayName,username';


export const useCurrentUser = ({ fields = defaultFields }: { fields?: string } = {}) => {
    const userQuery = useMemo(() => ({
        resource: 'me',
        params: {
            fields,
        },
    }), [fields]);

    return useApiDataQuery<User>({
        queryKey: ['loggedInUser', fields],
        query: userQuery,
    });
}