import React, { useEffect, useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { Button, Workbench } from '@contentful/forma-36-react-components';
import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';

import { ASSETS_FIELD_ID } from '../../constants';

import { DialogInvocationParams, Image, Layout, LayoutSettings } from '../../types';

type LayoutContainerProps = {
  sdk: DialogExtensionSDK;
};

const LayoutContainer = ({ sdk }: LayoutContainerProps) => {
  const params = sdk.parameters?.invocation as DialogInvocationParams;
  const { currentLayoutId, layoutIds, entryField, assets } = params;

  console.log({ params });

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

  debugger;
  const existingState = currentLayoutId && entryField?.[currentLayoutId];
  //currentLayoutId && entryField && entryField[currentLayoutId];

  console.log({ existingState });

  // const [settings, setSettings] = useState<LayoutSettings>({
  //   layoutId: '',
  //   title: '',
  //   enabled: true,
  //   aspectRatio: '5:4',
  //   maxWidth: 0,
  //   isValid: false,
  // });

  const [layout, setlayout] = useState<Layout>({
    ...(existingState || initialState),
  });

  const {settings} = layout;

  const [images, setImages] = useState<Image[]>([]);

  // TODO: Set initial values only on new records
  const newRecord = !currentLayoutId;

  console.log({ newRecord });

  const handleSettingsUpdate = (settings: LayoutSettings) => {
    console.log(`Settings updated ${JSON.stringify(settings)}`);
    setlayout({...layout, settings})
    // setSettings({ ...settings });

  };

  const handleSave = () => {
    sdk.close(layout);
  };

  // useEffect(() => {
  //   setlayout({ ...layout, settings: { ...settings } });
  // }, [settings]);

  useEffect(() => {
    console.log({ layout });
  }, [layout]);

  const elementsPanelDisabled = !(
    settings.isValid &&
    assets.length > 0 &&
    settings.enabled
  );
  // TODO: Make layout panel listen for whether any elements are
  // enabled on elements panel.
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
              panel: <LayoutElementsPanel elements={[]} />,
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
};;;;

export default LayoutContainer;
