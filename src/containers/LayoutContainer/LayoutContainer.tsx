import React, { useEffect, useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { Button, Workbench } from '@contentful/forma-36-react-components';
import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';
import constrainMaxWidth from './helpers/constrainMaxWidth';
import mergeDraggableElements from './helpers/mergeDraggableElements';
import mergeDraggableAssetWithPersistentState from './helpers/mergeDraggableAssetWithPersistentState';

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

  const initialSettings = {
    layoutId: '',
    title: '',
    enabled: true,
    aspectRatio: '5:4',
    maxWidth: 0,
    isValid: false,
  } as LayoutSettings;

  const initialState: Layout = {
    settings: initialSettings,
    elements: [],
    // elements: initialAssetState,
  };

  const [layout, setlayout] = useState<Layout>(
    initialState,
    // mergeState(persistedState, initialState),
  );

  const { settings } = layout;

  const handleSettingsUpdate = (settings: LayoutSettings) => {
    setlayout({ ...layout, settings });
  };

  const handleSave = () => {
    sdk.close(layout);
  };

  const handleSetPublishAsset = (id: string, value: boolean) => {
    // const elements = layout.elements;
    // elements[id] = {
    //   ...elements[id],
    //   published: value,
    // };

    setlayout(({ settings, elements }) => ({
      settings,
      elements: elements.map((element) => {
        return element.asset.id === id
          ? { ...element, published: value }
          : element;
      }),
    }));

    // setlayout({
    //   ...layout,
    //   elements,
    // });
  };

  const handleDragResize = (index: number, value: Draggable) => {
    const updatedState = { ...layout };
    updatedState.elements[index] = value;
    setlayout(updatedState);
  };

  useEffect(() => {
    console.log({ layout });
    console.log({ assets });
  }, [assets, layout]);

  const elementsPanelDisabled = !(
    settings.isValid &&
    assets.length > 0 &&
    settings.enabled
  );

  // TODO: Make layout panel listen for whether any elements are
  // enabled on elements panel. Probably need to split valid into an object that
  // can tell whether a given panel is valid.
  const layoutPanelDisabled = elementsPanelDisabled;

    useEffect(() => {
      // Wrap assets in Draggable
      const draggableAssets = assets.map((asset) => {
        const { height, width } = asset;
        const constrainedDimensions = constrainMaxWidth({
          width,
          height,
          constraint: 600,
        });

        return {
          published: false,
          originalHeight: height,
          originalWidth: width,
          position: {
            x: 0,
            y: 0,
          },
          asset,
          ...constrainedDimensions,
        } as Draggable;
      });

      if (currentLayoutId) {
        const persisted = entryField?.[currentLayoutId];
        if (persisted) {
          const merged = mergeDraggableAssetWithPersistentState({
            persisted: persisted.elements,
            assetState: draggableAssets,
          });
          setlayout({...persisted, elements: merged})
        }
      } else {
        setlayout({...layout, elements: draggableAssets})
      }
    }, [])

  // useEffect(() => {
  //   let persistedState = {
  //     settings: initialSettings,
  //     elements: [],
  //   };
  //   // If a an ID was passed in the parameters, load existing data from field
  //   if (currentLayoutId) {
  //     persistedState = entryField?.[currentLayoutId];
  //     if (persistedState) {
  //       // const merged = mergeState(persistedState, initialState);
  //       // setlayout({ settings: persistedState.settings, elements: [] });
  //       // settings = persistedState.settings;
  //     }
  //   }

  //   // Wrap assets in Draggable
  //   const DraggableAssets = assets.map((asset) => {
  //     const { height, width } = asset;
  //     const constrainedDimensions = constrainMaxWidth({
  //       width,
  //       height,
  //       constraint: 600,
  //     });

  //     return {
  //       published: false,
  //       originalHeight: height,
  //       originalWidth: width,
  //       position: {
  //         x: 0,
  //         y: 0,
  //       },
  //       asset,
  //       ...constrainedDimensions,
  //     } as Draggable;
  //   });

  //   const mergedElements = mergeDraggableElements({
  //     persisted: DraggableAssets,
  //     localState: persistedState.elements,
  //   });

  //   setlayout({ settings: persistedState.settings, elements: mergedElements });

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
};;

export default LayoutContainer;
