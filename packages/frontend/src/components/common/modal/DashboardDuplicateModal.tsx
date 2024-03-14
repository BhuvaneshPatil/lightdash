import { Dashboard } from '@lightdash/common';
import type { ModalProps } from '@mantine/core';
import {
    Button,
    Group,
    Modal,
    Stack,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { FC } from 'react';
import { useEffect } from 'react';
import {
    useDashboardQuery,
    useDuplicateDashboardMutation,
} from '../../../hooks/dashboard/useDashboard';

interface DashboardDuplicateModalProps extends ModalProps {
    uuid: string;
    onConfirm?: () => void;
}

type FormState = Pick<Dashboard, 'name' | 'description'>;

const DashboardDuplicateModal: FC<DashboardDuplicateModalProps> = ({
    uuid,
    onConfirm,
    ...modalProps
}) => {
    const { mutateAsync: duplicateDashboard, isLoading } =
        useDuplicateDashboardMutation({
            showRedirectButton: true,
        });
    const { data: dashboard, isInitialLoading } = useDashboardQuery(uuid);

    const form = useForm<FormState>({
        initialValues: {
            name: '',
            description: '',
        },
    });

    const { setValues } = form;

    useEffect(() => {
        if (!dashboard) return;
        setValues({
            name: 'Copy - ' + dashboard.name,
            description: dashboard.description ?? '',
        });
    }, [dashboard, setValues]);

    if (isInitialLoading || !dashboard) {
        return null;
    }

    const handleConfirm = form.onSubmit(async (data) => {
        await duplicateDashboard({
            uuid: uuid,
            name: data.name,
            description: data.description,
        });
        onConfirm?.();
    });

    return (
        <Modal
            title={<Title order={4}>Duplicate Dashboard</Title>}
            {...modalProps}
        >
            <form title="Duplicate Dashboard" onSubmit={handleConfirm}>
                <Stack spacing="lg" pt="sm">
                    <TextInput
                        label="Enter a memorable name for your dashboard"
                        required
                        placeholder="eg. KPI Dashboards"
                        disabled={isLoading}
                        {...form.getInputProps('name')}
                    />

                    <Textarea
                        label="Description"
                        placeholder="A few words to give your team some context"
                        disabled={isLoading}
                        autosize
                        maxRows={3}
                        {...form.getInputProps('description')}
                    />

                    <Group position="right" mt="sm">
                        <Button variant="outline" onClick={modalProps.onClose}>
                            Cancel
                        </Button>

                        <Button
                            disabled={!form.isValid()}
                            loading={isLoading}
                            type="submit"
                        >
                            Create duplicate
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};

export default DashboardDuplicateModal;
