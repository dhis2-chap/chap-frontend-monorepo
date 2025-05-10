import React, { useState } from "react"
import {
    FlyoutMenu,
    IconDelete16,
    IconEdit16,
    IconShare16,
    MenuItem,
    SharingDialog,
    SplitButton
} from "@dhis2/ui"
import i18n from "@dhis2/d2-i18n"
import { EditRoute } from "../EditRoute"
import type { Route } from "../../../../hooks/useRoute"
import { DeleteRouteModal } from "../DeleteRouteModal"
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    route: Route
}

export const RouteActions = ({ route }: Props) => {
    const queryClient = useQueryClient();
    const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    return (
        <>
            <SplitButton
                icon={<IconShare16 />}
                small
                onClick={() => setIsSharingDialogOpen(true)}
                component={
                    <FlyoutMenu>
                        <MenuItem
                            dense
                            onClick={() => setIsEditDialogOpen(true)}
                            label={i18n.t('Edit')}
                            icon={<IconEdit16 />}
                        />
                        <MenuItem
                            dense
                            onClick={() => setIsDeleteDialogOpen(true)}
                            label={i18n.t('Delete')}
                            icon={<IconDelete16 />}
                            destructive
                        />
                    </FlyoutMenu>
                }
            >
                {i18n.t('Sharing')}
            </SplitButton>

            {isSharingDialogOpen && (
                <SharingDialog
                    id={route.id}
                    type="route"
                    onClose={() => {
                        queryClient.invalidateQueries({ queryKey: ['routes'] });
                        setIsSharingDialogOpen(false)
                    }}
                />
            )}

            {isDeleteDialogOpen && (
                <DeleteRouteModal
                    routeId={route.id}
                    onClose={() => setIsDeleteDialogOpen(false)}
                />
            )}

            {isEditDialogOpen && (
                <EditRoute
                    route={route}
                    onClose={() => setIsEditDialogOpen(false)}
                />
            )}
        </>
    )
} 