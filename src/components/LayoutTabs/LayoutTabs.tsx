import React, { ReactElement, useState } from 'react';
import { Tab, TabPanel, Tabs } from '@contentful/forma-36-react-components';

type LayoutTabsProps = {
  elements: Element[];
};

type Element = {
  id: TabOptions;
  label: string;
  disabled: boolean;
  panel: ReactElement;
};

type TabOptions = 'settings' | 'elements' | 'layout';

const LayoutTabs = ({ elements }: LayoutTabsProps) => {
  const [selectedTab, setselectedTab] = useState<TabOptions>('settings');

  const activeElement = elements.find(({ id }) => selectedTab === id);

  return (
    <>
      <Tabs role="navigation" withDivider>
        {elements.map(({ id, label, disabled }) => (
          <Tab
            id={id}
            key={id}
            disabled={disabled}
            selected={selectedTab === id}
            onSelect={() => {
              setselectedTab(id);
            }}
          >
            {label}
          </Tab>
        ))}
      </Tabs>
      {activeElement && (
        <TabPanel id={activeElement.id}>{activeElement.panel}</TabPanel>
      )}
    </>
  );
};

export default LayoutTabs;
