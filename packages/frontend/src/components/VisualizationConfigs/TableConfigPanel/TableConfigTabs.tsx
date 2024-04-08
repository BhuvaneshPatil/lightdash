import { Accordion, MantineProvider } from '@mantine/core';
import { memo, type FC } from 'react';
import { getAccordionConfigTabsStyles, themeOverride } from '../mantineTheme';
import ConditionalFormattingList from './ConditionalFormattingList';
import GeneralSettings from './GeneralSettings';

export const ConfigTabs: FC = memo(() => (
    <MantineProvider inherit theme={themeOverride}>
        <Accordion
            radius="none"
            styles={getAccordionConfigTabsStyles}
            defaultValue="general"
        >
            <Accordion.Item value="general">
                <Accordion.Control>General</Accordion.Control>
                <Accordion.Panel>
                    <GeneralSettings />
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="conditional-formatting">
                <Accordion.Control>Conditional formatting</Accordion.Control>
                <Accordion.Panel>
                    <ConditionalFormattingList />
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </MantineProvider>
));
