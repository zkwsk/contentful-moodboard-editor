import React, { useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';

import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import getImages from './getImages';
import { IMAGES_FIELD_ID } from '../../constants';

import { Image } from "../../types";

type LayoutContainerProps = {
  sdk: DialogExtensionSDK;
  layoutId: string | false | undefined;
};


const LayoutContainer = ({sdk, layoutId} : LayoutContainerProps) => {

  const [layout, setlayout] = useState()
  const [images, setImages] = useState<Image[]>([]);

  // getImages({sdk: sdk, fieldId: IMAGES_FIELD_ID});


  const newRecord = !(layoutId);

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
          panel: <h1>Elements page</h1>,
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
