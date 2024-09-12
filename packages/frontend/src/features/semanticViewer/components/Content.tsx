import {
    DimensionType,
    FieldType,
    SemanticLayerSortByDirection,
} from '@lightdash/common';
import { Button, Center, Group, SegmentedControl, Text } from '@mantine/core';
import {
    IconArrowDown,
    IconArrowUp,
    IconChartHistogram,
    IconTable,
} from '@tabler/icons-react';
import { useEffect, useMemo, type FC } from 'react';
import MantineIcon from '../../../components/common/MantineIcon';
import SuboptimalState from '../../../components/common/SuboptimalState/SuboptimalState';
import { TableFieldIcon } from '../../../components/DataViz/Icons';
import useToaster from '../../../hooks/toaster/useToaster';
import { useSemanticLayerQueryResults } from '../api/hooks';
import { SemanticViewerResultsRunner } from '../runners/SemanticViewerResultsRunner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    selectAllSelectedFieldNames,
    selectAllSelectedFieldsByKind,
    selectSemanticLayerInfo,
} from '../store/selectors';
import {
    EditorTabs,
    setActiveEditorTab,
    setResults,
    updateSortBy,
} from '../store/semanticViewerSlice';
import ContentCharts from './ContentCharts';
import ContentResults from './ContentResults';
import Filters from './Filters';
import { RunSemanticQueryButton } from './RunSemanticQueryButton';

const Content: FC = () => {
    const dispatch = useAppDispatch();
    const { showToastError } = useToaster();

    const allSelectedFieldNames = useAppSelector(selectAllSelectedFieldNames);
    const { projectUuid } = useAppSelector(selectSemanticLayerInfo);
    const { results, view, activeEditorTab, sortBy, fields } = useAppSelector(
        (state) => state.semanticViewer,
    );

    const allSelectedFieldsByKind = useAppSelector(
        selectAllSelectedFieldsByKind,
    );

    const handleAddSortBy = (fieldName: string, kind: FieldType) => {
        dispatch(updateSortBy({ name: fieldName, kind }));
    };

    const selectedFieldsCount =
        allSelectedFieldsByKind.dimensions.length +
        allSelectedFieldsByKind.metrics.length +
        allSelectedFieldsByKind.timeDimensions.length;

    const {
        data: requestData,
        mutateAsync: runSemanticViewerQuery,
        isLoading,
    } = useSemanticLayerQueryResults(projectUuid, {
        onError: (data) => {
            showToastError({
                title: 'Could not fetch SQL query results',
                subtitle: data.error.message,
            });
        },
    });

    const resultsData = useMemo(() => requestData?.results, [requestData]);
    const resultsColumns = useMemo(() => requestData?.columns, [requestData]);

    useEffect(() => {
        if (!resultsColumns || !resultsData) return;

        const vizColumns =
            SemanticViewerResultsRunner.convertColumnsToVizColumns(
                fields,
                resultsColumns,
            );

        dispatch(setResults({ results: resultsData, columns: vizColumns }));
    }, [dispatch, resultsData, resultsColumns, fields]);

    return (
        <>
            <Group
                px="md"
                py="sm"
                bg="gray.1"
                sx={(theme) => ({
                    borderBottom: `1px solid ${theme.colors.gray[3]}`,
                })}
                position="apart"
            >
                <Group>
                    <SegmentedControl
                        color="dark"
                        size="sm"
                        radius="sm"
                        data={[
                            {
                                value: EditorTabs.RESULTS,
                                label: (
                                    <Group spacing="xs" noWrap>
                                        <MantineIcon icon={IconTable} />
                                        <Text>Results</Text>
                                    </Group>
                                ),
                            },
                            {
                                value: EditorTabs.VISUALIZATION,
                                label: (
                                    <Group spacing="xs" noWrap>
                                        <MantineIcon
                                            icon={IconChartHistogram}
                                        />
                                        <Text>Chart</Text>
                                    </Group>
                                ),
                            },
                        ]}
                        disabled={
                            allSelectedFieldNames.length === 0 ||
                            results.length === 0
                        }
                        value={activeEditorTab}
                        onChange={(value: EditorTabs) => {
                            dispatch(setActiveEditorTab(value));
                        }}
                    />

                    {!!view && <Filters onApply={runSemanticViewerQuery} />}
                </Group>

                <RunSemanticQueryButton
                    onClick={runSemanticViewerQuery}
                    isLoading={isLoading}
                />
            </Group>
            {selectedFieldsCount > 0 && (
                <Group
                    px="md"
                    pt="sm"
                    bg="gray.1"
                    sx={(theme) => ({
                        borderBottom: `1px solid ${theme.colors.gray[3]}`,
                    })}
                    spacing="xxs"
                    align="baseline"
                >
                    <Text fw={600} h="100%" mr="xs">
                        Sort by:
                    </Text>
                    {Object.entries(allSelectedFieldsByKind).map(
                        ([kind, selectedFields]) =>
                            selectedFields.map((field) => {
                                // TODO: this is annoying
                                const normalKind =
                                    kind === 'metrics'
                                        ? FieldType.METRIC
                                        : FieldType.DIMENSION;

                                const sortDirection = sortBy.find(
                                    (s) =>
                                        s.name === field.name &&
                                        s.kind === normalKind,
                                )?.direction;

                                return (
                                    <Button
                                        key={`${kind}-${field.name}`}
                                        variant={
                                            sortDirection ? 'filled' : 'outline'
                                        }
                                        leftIcon={
                                            <TableFieldIcon
                                                fieldType={
                                                    kind === 'metrics'
                                                        ? DimensionType.NUMBER
                                                        : DimensionType.STRING
                                                }
                                            />
                                        }
                                        size="sm"
                                        mr="xs"
                                        mb="xs"
                                        color="gray"
                                        compact
                                        onClick={() =>
                                            handleAddSortBy(
                                                field.name,
                                                normalKind,
                                            )
                                        }
                                        rightIcon={
                                            sortDirection && (
                                                <MantineIcon
                                                    icon={
                                                        sortDirection ===
                                                        SemanticLayerSortByDirection.ASC
                                                            ? IconArrowUp
                                                            : IconArrowDown
                                                    }
                                                ></MantineIcon>
                                            )
                                        }
                                    >
                                        {field.name}
                                    </Button>
                                );
                            }),
                    )}
                </Group>
            )}

            {!view ? (
                <Center sx={{ flexGrow: 1 }}>
                    <SuboptimalState
                        title="Select a view"
                        description="Please select a view from the sidebar to start building a query"
                    />
                </Center>
            ) : results.length === 0 ? (
                <Center sx={{ flexGrow: 1 }}>
                    <SuboptimalState
                        title="No results"
                        description="Select some fields, then run the query to see results."
                    />
                </Center>
            ) : activeEditorTab === EditorTabs.RESULTS ? (
                <ContentResults />
            ) : activeEditorTab === EditorTabs.VISUALIZATION ? (
                <ContentCharts />
            ) : null}
        </>
    );
};

export default Content;
