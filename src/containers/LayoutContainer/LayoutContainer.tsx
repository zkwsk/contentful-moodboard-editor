import React, { useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';

import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';

import { ASSETS_FIELD_ID } from '../../constants';

import { DialogInvocationParams, Image, LayoutSettings } from '../../types';

type LayoutContainerProps = {
  layoutProps: DialogInvocationParams;
  sdk: DialogExtensionSDK;
};


const LayoutContainer = ({ sdk, layoutProps }: LayoutContainerProps) => {
  const { currentLayoutId, layoutIds, entryField, assets } = layoutProps;

  const [settings, setSettings] = useState<LayoutSettings>({
    layoutId: '',
    title: '',
    enabled: true,
    aspectRatio: '5:4',
    maxWidth: 0,
    isValid: false,
  });

  const [layout, setlayout] = useState();
  const [images, setImages] = useState<Image[]>([]);

  const newRecord = !currentLayoutId;

  const handleSettingsUpdate = (settings: LayoutSettings) => {
    console.log(`Settings updated ${JSON.stringify(settings)}`);
    setSettings({ ...settings });
  };

  const elementsPanelDisabled = !(settings.isValid && assets.length > 0 && settings.enabled);
  // TODO: Make layout panel listen for whether any elements are 
  // enabled on elements panel.
  const layoutPanelDisabled = elementsPanelDisabled;

  return (
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
  );
};

export default LayoutContainer;
