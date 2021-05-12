import React, { useEffect, useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { Button, Workbench } from '@contentful/forma-36-react-components';
import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';

import { DialogInvocationParams, Layout, LayoutSettings } from '../../types';

type LayoutContainerProps = {
  sdk: DialogExtensionSDK;
};

const LayoutContainer = ({ sdk }: LayoutContainerProps) => {
  const params = sdk.parameters?.invocation as DialogInvocationParams;
  const { currentLayoutId, layoutIds, entryField, assets } = params;

console.log({ assets });

  const initialState: Layout = {
    settings: {
      layoutId: '',
      title: '',
      enabled: true,
      aspectRatio: '5:4',
      maxWidth: 0,
      isValid: false,
    },
    elements: [],
  };

  const existingState = currentLayoutId && entryField?.[currentLayoutId];

  const [layout, setlayout] = useState<Layout>({
    ...(existingState || initialState),
  });

  const {settings} = layout;

  const handleSettingsUpdate = (settings: LayoutSettings) => {
    setlayout({...layout, settings})
  };

  const handleSave = () => {
    sdk.close(layout);
  };

  // useEffect(() => {
  //   console.log({ layout });
  // }, [layout]);

  const elementsPanelDisabled = !(
    settings.isValid &&
    assets.length > 0 &&
    settings.enabled
  );

  // TODO: Make layout panel listen for whether any elements are
  // enabled on elements panel. Probably need to split valid into an object that
  // can tell whether a given panel is valid.
  const layoutPanelDisabled = elementsPanelDisabled;

  return (
    <Workbench>
      <Workbench.Header
        title="Create Layout"
        actions={
          <Button disabled={!settings.isValid} onClick={handleSave}>
            Save
          </Button>
        }
        onBack={() => {
          sdk.close();
        }}
      />
      <Workbench.Content type="default">
        <LayoutTabs
          elements={[
            {
              id: 'settings',
              label: 'Settings',
              disabled: false,
              panel: (
                <LayoutSettingsPanel
                  settings={settings}
                  layoutIds={layoutIds}
                  onUpdate={handleSettingsUpdate}
                />
              ),
            },
            {
              id: 'elements',
              label: 'Elements',
              disabled: elementsPanelDisabled,
              panel: <LayoutElementsPanel elements={assets} />,
            },
            {
              id: 'layout',
              label: 'Layout',
              disabled: layoutPanelDisabled,
              panel: <h1>Layout page</h1>,
            },
          ]}
        />
      </Workbench.Content>
    </Workbench>
  );
}

export default LayoutContainer;
