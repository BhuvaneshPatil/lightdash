import { ApiCommentsResults, ApiError } from '@lightdash/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lightdashApi } from '../../../api';

type CreateDashboardTileComment = {
    projectUuid: string;
    dashboardUuid: string;
    dashboardTileUuid: string;
    text: string;
    replyTo?: string;
};

const createDashboardTileComment = async ({
    dashboardUuid,
    dashboardTileUuid,
    text,
    replyTo,
}: CreateDashboardTileComment) =>
    lightdashApi<null>({
        url: `/dashboards/${dashboardUuid}/${dashboardTileUuid}/comments`,
        method: 'POST',
        body: JSON.stringify({
            text,
            replyTo,
        }),
    });

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation<null, ApiError, CreateDashboardTileComment>(
        (data) => createDashboardTileComment(data),
        {
            mutationKey: ['create-comment'],
            onSuccess: async (_, { dashboardTileUuid, dashboardUuid }) => {
                await queryClient.invalidateQueries([
                    'comments',
                    dashboardUuid,
                    dashboardTileUuid,
                ]);
            },
            retry: (_, error) => error.error.statusCode !== 403,
        },
    );
};

const getDashboardTileComments = async ({
    dashboardTileUuid,
    dashboardUuid,
}: Pick<CreateDashboardTileComment, 'dashboardTileUuid' | 'dashboardUuid'>) =>
    lightdashApi<ApiCommentsResults>({
        url: `/dashboards/${dashboardUuid}/${dashboardTileUuid}/comments`,
        method: 'GET',
        body: undefined,
    });

export const useGetComments = (
    dashboardUuid: string,
    dashboardTileUuid: string,
) => {
    return useQuery<ApiCommentsResults, ApiError>(
        ['comments', dashboardUuid, dashboardTileUuid],
        () => getDashboardTileComments({ dashboardTileUuid, dashboardUuid }),
        {
            retry: (_, error) => error.error.statusCode !== 403,
        },
    );
};

const removeComment = async ({
    commentId,
    dashboardTileUuid,
    dashboardUuid,
}: { commentId: string } & Pick<
    CreateDashboardTileComment,
    'dashboardTileUuid' | 'dashboardUuid'
>) =>
    lightdashApi<null>({
        url: `/dashboards/${dashboardUuid}/${dashboardTileUuid}/comments/${commentId}`,
        method: 'DELETE',
        body: undefined,
    });

export const useRemoveComment = () => {
    const queryClient = useQueryClient();

    return useMutation<
        null,
        ApiError,
        { commentId: string } & Pick<
            CreateDashboardTileComment,
            'dashboardTileUuid' | 'dashboardUuid'
        >
    >((data) => removeComment(data), {
        mutationKey: ['remove-comment'],
        onSuccess: async (_, { dashboardTileUuid, dashboardUuid }) => {
            await queryClient.invalidateQueries([
                'comments',
                dashboardUuid,
                dashboardTileUuid,
            ]);
        },
    });
};
