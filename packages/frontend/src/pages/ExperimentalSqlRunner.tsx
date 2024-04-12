import { Flex, ScrollArea, Stack, Tabs, Title } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useMemo, useState } from 'react';
import Page from '../components/common/Page/Page';
import QueryConfig from './Experimental/components/Query';
import VizConfig from './Experimental/components/VizConfig';
import VizLib from './Experimental/components/VizLib';
import { type QuerySourceDto } from './Experimental/Dto/QuerySourceDto/QuerySourceDto';
import { VizConfigDto } from './Experimental/Dto/VizConfigDto/VizConfigDto';
import { type VizConfiguration } from './Experimental/types';

const ExperimentalSqlRunner = () => {
    const [vizConf, setVizConf] = useState<VizConfiguration>({
        libType: 'echarts',
    });
    const [sourceDto, setSourceDto] = useState<QuerySourceDto>();

    const vizDto = useMemo(() => {
        if (sourceDto) {
            return new VizConfigDto({
                vizConfig: vizConf,
                sourceDto: sourceDto,
            });
        }
    }, [sourceDto, vizConf]);

    const vizLibDto = useMemo(() => {
        if (vizDto) {
            return vizDto.getVizLib();
        }
    }, [vizDto]);

    return (
        <Page title="SQL Runner" withFullHeight withPaddedContent>
            <Stack spacing={'xl'}>
                <Stack>
                    <Title order={2}>Query</Title>
                    <Tabs defaultValue="ui">
                        <Tabs.List>
                            <Tabs.Tab value="ui">UI</Tabs.Tab>
                            <Tabs.Tab value="json">Debug</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="ui" pt="xs">
                            <QueryConfig onSourceDtoChange={setSourceDto} />
                        </Tabs.Panel>

                        <Tabs.Panel value="json" pt="xs">
                            {sourceDto && (
                                <ScrollArea.Autosize
                                    mah={500}
                                    w={'100%'}
                                    mx="auto"
                                    placeholder={'json'}
                                >
                                    <Prism
                                        colorScheme="light"
                                        withLineNumbers
                                        language="json"
                                    >
                                        {JSON.stringify(
                                            sourceDto.getData(),
                                            null,
                                            2,
                                        )}
                                    </Prism>
                                </ScrollArea.Autosize>
                            )}
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
                <Stack>
                    <Title order={2}>Viz configuration</Title>
                    <Tabs defaultValue="ui">
                        <Tabs.List>
                            <Tabs.Tab value="ui">UI</Tabs.Tab>
                            <Tabs.Tab value="json">Debug</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="ui" pt="xs">
                            {vizDto && (
                                <VizConfig
                                    value={vizConf}
                                    onChange={setVizConf}
                                    libOptions={vizDto.getVizLibOptions()}
                                    vizOptions={vizDto.getVizOptions()}
                                    xAxisOptions={vizDto.getXAxisOptions()}
                                    yAxisOptions={vizDto.getYAxisOptions()}
                                    pivotOptions={vizDto.getPivotOptions()}
                                />
                            )}
                        </Tabs.Panel>

                        <Tabs.Panel value="json" pt="xs">
                            {vizConf && (
                                <ScrollArea.Autosize
                                    mah={500}
                                    w={'100%'}
                                    mx="auto"
                                    placeholder={'json'}
                                >
                                    <Prism
                                        colorScheme="light"
                                        withLineNumbers
                                        language="json"
                                    >
                                        {JSON.stringify(vizConf, null, 2)}
                                    </Prism>
                                </ScrollArea.Autosize>
                            )}
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
                <Stack>
                    <Title order={2}>Viz library</Title>
                    <Tabs defaultValue="ui">
                        <Tabs.List>
                            <Tabs.Tab value="ui">UI</Tabs.Tab>
                            <Tabs.Tab value="json">Debug</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="ui" pt="xs">
                            <Flex sx={{ flex: 1, height: '300px' }}>
                                {vizLibDto && <VizLib vizLibDto={vizLibDto} />}
                            </Flex>
                        </Tabs.Panel>

                        <Tabs.Panel value="json" pt="xs">
                            {vizLibDto && (
                                <ScrollArea.Autosize
                                    mah={500}
                                    w={'100%'}
                                    mx="auto"
                                    placeholder={'json'}
                                >
                                    <Prism
                                        colorScheme="light"
                                        withLineNumbers
                                        language="json"
                                    >
                                        {JSON.stringify(
                                            vizLibDto.getConfig(),
                                            null,
                                            2,
                                        )}
                                    </Prism>
                                </ScrollArea.Autosize>
                            )}
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </Stack>
        </Page>
    );
};

export default ExperimentalSqlRunner;
