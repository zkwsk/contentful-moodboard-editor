import React, { useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';

import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';

import { ASSETS_FIELD_ID } from '../../constants';

import { Image } from "../../types";

type LayoutContainerProps = {
  sdk: DialogExtensionSDK;
  layoutId: string | false | undefined;
};


const LayoutContainer = ({sdk, layoutId} : LayoutContainerProps) => {

  const [layout, setlayout] = useState()
  const [images, setImages] = useState<Image[]>([]);

  const newRecord = !layoutId;

  
  


  return (
    <LayoutTabs
      elements={[
        {
          id: 'settings',
          label: 'Settings',
          panel: <LayoutSettingsPanel newRecord={newRecord} />,
        },
        {
          id: 'elements',
          label: 'Elements',
          panel: <LayoutElementsPanel elements={[]} />,
        },
        {
          id: 'layout',
          label: 'Layout',
          panel: <h1>Layout page</h1>,
        },
      ]}
    />
  );
};

export default LayoutContainer;
