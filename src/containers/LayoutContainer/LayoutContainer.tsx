import React, { useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { Button, Workbench } from '@contentful/forma-36-react-components';
import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';

import {
  DialogInvocationParams,
  Draggable,
  Layout,
  LayoutSettings,
} from '../../types';
import LayoutCanvas from '../../components/LayoutCanvas';

type LayoutContainerProps = {
  sdk: DialogExtensionSDK;
};

const LayoutContainer = ({ sdk }: LayoutContainerProps) => {
  const params = sdk.parameters?.invocation as DialogInvocationParams;
  const { currentLayoutId, layoutIds, entryField, assets } = params;

  const constrainMaxWidth = ({
    width,
    height,
    constraint,
  }: {
    height: number;
    width: number;
    constraint: number;
  }) => {
    if (width < constraint) {
      return {
        maxHeight: height,
        maxWidth: width,
      };
    }

    const ratio = constraint / width;

    return {
      maxWidth: ratio * width,
      maxHeight: ratio * height,
    };
  };

  const initialAssetState = assets.map((asset) => {
    debugger;
    const { height, width } = asset;
    const { maxHeight, maxWidth } = constrainMaxWidth({
      height,
      width,
      constraint: 600,
    });

    return {
      published: false,
      height: maxHeight,
      width: maxWidth,
      originalHeight: height,
      originalWidth: width,
      position: {
        x: 0,
        y: 0,
      },
      asset,
    } as Draggable;
  });

  const initialState: Layout = {
    settings: {
      layoutId: '',
      title: '',
      enabled: true,
      aspectRatio: '5:4',
      maxWidth: 0,
      isValid: false,
    },
    elements: initialAssetState,
  };

  const mergeState = (assetState: Layout, existingState?: Layout) => {
    if (!existingState) {
      // We're creating a new record
      return assetState;
    }

    const assetIds = assetState.elements.map(({ asset }) => asset.id);

    // Filter existing state so only records that match ids on asset state are
    // included. This is done to take account for assets being deleted.
    const filteredExistingElements = existingState.elements.filter(
      ({ asset }) => assetIds.includes(asset.id),
    );

    const existingStateIds = filteredExistingElements.map(
      ({ asset }) => asset.id,
    );

    const newElements = assetState.elements.filter(
      ({ asset }) => !existingStateIds.includes(asset.id),
    );

    return {
      ...existingState,
      elements: [...filteredExistingElements, ...newElements],
    } as Layout;
  };

  const existingState =
    (currentLayoutId && entryField?.[currentLayoutId]) || undefined;

  const [layout, setlayout] = useState<Layout>(
    mergeState(initialState, existingState),
  );

  const { settings } = layout;

  const handleSettingsUpdate = (settings: LayoutSettings) => {
    setlayout({ ...layout, settings });
  };

  const handleSave = () => {
    sdk.close(layout);
  };

  const handleSetPublishAsset = (id: number, value: boolean) => {
    const elements = layout.elements;
    elements[id] = {
      ...elements[id],
      published: value,
    };

    setlayout({
      ...layout,
      elements,
    });
  };

  const handleDragResize = (index: number, value: Draggable) => {
    const updatedState = { ...layout };
    updatedState.elements[index] = value;
    setlayout(updatedState);
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
      <Workbench.Content type="default" className="workbench-full-width">
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
              panel: (
                <LayoutElementsPanel
                  elements={layout.elements}
                  onSetPublish={handleSetPublishAsset}
                />
              ),
            },
            {
              id: 'layout',
              label: 'Layout',
              disabled: layoutPanelDisabled,
              panel: (
                <LayoutCanvas layout={layout} onDragResize={handleDragResize} />
              ),
            },
          ]}
        />
      </Workbench.Content>
    </Workbench>
  );
};

export default LayoutContainer;
