import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Draggable as DraggableType, Layout } from '../../types';

import 'react-resizable/css/styles.css';
import { LayoutCanvasElement } from './LayoutCanvasElement';
import parseAspectRatio from '../../utilities/parseAspectRatio';

type LayoutCanvasProps = {
  layout: Layout;
  onDragResize: (id: string, value: DraggableType) => void;
};

const LayoutCanvas = ({ layout, onDragResize }: LayoutCanvasProps) => {
  const { elements, settings } = layout;
  const publishedElements = elements.filter(({ published }) => published);

  const [aspectX, aspectY] = parseAspectRatio(settings.aspectRatio);

  const grid = [
    settings?.snap?.x ? settings.snap.x : 1,
    settings?.snap?.y ? settings.snap.y : 1,
  ] as [number, number];

  const canvasHeight = (aspectY / aspectX) * settings.maxWidth + 'px';

  const guideDefinition: number[] = [];

  if (settings.guides?.guideCount) {
    for (let i = 1; i < settings.guides.guideCount; i++) {
      guideDefinition.push((1 / settings.guides.guideCount) * i * 100);
    }
  }

  const guide = ({ height, offset }: { height: string; offset: number }) => (
    <div
      className="layout-guide"
      style={{
        position: 'absolute',
        height,
        borderLeft: 'black 1px dotted',
        left: offset + '%',
      }}
    ></div>
  );

  return (
    <div
      style={{
        position: 'relative',
        border: '1px dotted black',
        width: settings.maxWidth,
        height: canvasHeight,
        marginTop: 'var(--spacing-m)',
      }}
    >
      {publishedElements.map((element, index) => {
        const {
          height,
          width,
          position: { x, y },
          asset,
        } = element;
        return (
          <>
            {settings.guides?.enabled && (
              <div className="layout-guides">
                {guideDefinition.map((offset) =>
                  guide({ height: canvasHeight, offset }),
                )}
              </div>
            )}

            <Draggable
              key={asset.id}
              grid={grid}
              bounds={'parent'}
              defaultPosition={{ x, y }}
              cancel={'.react-resizable-handle'}
              onStop={(e, { x, y }) => {
                onDragResize(asset.id, {
                  ...element,
                  position: { x, y },
                });
              }}
            >
              <ResizableBox
                className="resizable-box-width-border"
                height={height}
                width={width}
                lockAspectRatio={true}
                resizeHandles={['se']}
                onResizeStop={(event, data) => {
                  onDragResize(asset.id, {
                    ...element,
                    height: data.size.height,
                    width: data.size.width,
                  });
                }}
              >
                <LayoutCanvasElement element={element} />
              </ResizableBox>
            </Draggable>
          </>
        );
      })}
    </div>
  );
};

export default LayoutCanvas;
