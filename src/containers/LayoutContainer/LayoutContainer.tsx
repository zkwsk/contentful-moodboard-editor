import React, { useEffect, useState } from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { Button, Workbench } from '@contentful/forma-36-react-components';
import LayoutTabs from '../../components/LayoutTabs';
import LayoutSettingsPanel from '../../components/LayoutSettingsPanel';
import LayoutElementsPanel from '../../components/LayoutElementsPanel';
import constrainMaxWidth from './helpers/constrainMaxWidth';
import mergeDraggableAssetWithPersistentState from './helpers/mergeDraggableAssetWithPersistentState';

import {
  DialogInvocationParams,
  Draggable,
  HandleAlignElementProps,
  Layout,
  LayoutSettings,
  Position,
} from '../../types';
import LayoutCanvas from '../../components/LayoutCanvas';
import parseAspectRatio from '../../utilities/parseAspectRatio';
import aspectRatioToDecimal from '../../utilities/aspectRatioToDecimal';
import useForceUpdate from '../../utilities/useForceUpdate';

type LayoutContainerProps = {
  sdk: DialogExtensionSDK;
};

const LayoutContainer = ({ sdk }: LayoutContainerProps) => {
  const params = sdk.parameters?.invocation as DialogInvocationParams;
  const { currentLayoutId, layoutIds, entryField, assets } = params;

  const forceUpdate = useForceUpdate();

  const initialSettings = {
    layoutId: '',
    title: '',
    enabled: true,
    aspectRatio: '5:4',
    maxWidth: 0,
    isValid: {
      settings: false,
      elements: false,
      canvas: false,
    },
    snap: {
      x: 20,
      y: 20,
    },
    guides: {
      enabled: true,
      guideCount: 12,
    },
  } as LayoutSettings;

  const initialState: Layout = {
    settings: initialSettings,
    elements: [],
  };

  const [layout, setlayout] = useState<Layout>(initialState);

  const { settings } = layout;

  const handleSettingsUpdate = (settings: LayoutSettings) => {
    setlayout({ ...layout, settings });
  };

  const handleSave = () => {
    sdk.close(layout);
  };

  const handleSetPublishAsset = (id: string, value: boolean) => {
    setlayout(({ settings, elements }) => ({
      settings,
      elements: elements.map((element) => {
        return element.asset.id === id
          ? { ...element, published: value }
          : element;
      }),
    }));
  };

  const handleAlignElement = ({ id, align }: HandleAlignElementProps) => {
    const currentElement = layout.elements.find(
      (element) => element.asset.id === id,
    );
    if (!currentElement) {
      return;
    }

    let alignedPosition: Position | null = null;

    if (align === 'center') {
      alignedPosition = {
        ...currentElement.position,
        x: layout.settings.maxWidth / 2 - currentElement.width / 2,
      };
    }
    if (align === 'top') {
      alignedPosition = {
        ...currentElement.position,
        y: 0,
      };
    }
    if (align === 'right') {
      alignedPosition = {
        ...currentElement.position,
        x: layout.settings.maxWidth - currentElement.width,
      };
    }
    if (align === 'bottom') {
      alignedPosition = {
        ...currentElement.position,
        y:
          layout.settings.maxWidth /
            aspectRatioToDecimal(
              parseAspectRatio(layout.settings.aspectRatio),
            ) -
          currentElement.height,
      };
    }
    if (align === 'left') {
      alignedPosition = {
        ...currentElement.position,
        x: 0,
      };
    }

    if (!alignedPosition) {
      return;
    }

    setlayout((prevState) => {
      const { elements } = prevState;

      return {
        ...prevState,
        elements: elements.map((element) => {
          return element.asset.id === id
            ? { ...element, position: alignedPosition }
            : element;
        }),
      } as Layout;
    });
  };

  const handleDragResize = (id: string, value: Draggable) => {
    setlayout(({ settings, elements }) => ({
      settings,
      elements: elements.map((element) => {
        return element.asset.id === id ? value : element;
      }),
    }));

    if (settings?.snap?.x) {
      // TODO: Does not seem to do anything
      console.log('Force update');
      forceUpdate();
    }
  };

  // useEffect(() => {
  //   console.log({ layout });
  //   console.log({ assets });
  // }, [assets, layout]);

  useEffect(() => {
    const publishedElements = layout.elements.filter(({ published }) => {
      return published;
    });

    publishedElements.length > 0
      ? setlayout({
          ...layout,
          settings: {
            ...layout.settings,
            isValid: { ...layout.settings.isValid, elements: true },
          },
        })
      : setlayout({
          ...layout,
          settings: {
            ...layout.settings,
            isValid: { ...layout.settings.isValid, elements: false },
          },
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.elements]);

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
        setlayout({ ...persisted, elements: merged });
      }
    } else {
      setlayout({ ...layout, elements: draggableAssets });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Workbench>
      <Workbench.Header
        title="Create Layout"
        actions={
          <Button disabled={!settings.isValid.elements} onClick={handleSave}>
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
              disabled: !settings.isValid.settings,
              panel: (
                <LayoutElementsPanel
                  elements={layout.elements}
                  onSetPublish={handleSetPublishAsset}
                  onAlignElement={handleAlignElement}
                />
              ),
            },
            {
              id: 'layout',
              label: 'Layout',
              disabled: !settings.isValid.elements,
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
