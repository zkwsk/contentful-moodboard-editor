import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Draggable as DraggableType, Layout } from '../../types';

import 'react-resizable/css/styles.css';
import { LayoutCanvasElement } from './LayoutCanvasElement';

type LayoutCanvasProps = {
  layout: Layout;
  onDragResize: (index: number, value: DraggableType) => void;
};

const LayoutCanvas = ({ layout, onDragResize }: LayoutCanvasProps) => {
  const { elements, settings } = layout;
  const publishedElements = elements.filter(({ published }) => published);

  const [aspectX, aspectY] = settings.aspectRatio.split(':').map(element => parseInt(element, 10)) as [number, number];

  // TODO: Disabled. Currently bounds are offset by the previous elements height
  const bounds = false && {
    top: 0,
    left: 0
  }
  const grid = [
    settings?.snap?.x ? settings.snap.x : 1,
    settings?.snap?.y ? settings.snap.y : 1,
  ] as [number, number];

  return (
    <div
      style={{
        border: '1px dotted black',
        width: settings.maxWidth,
        height: (aspectY / aspectX) * settings.maxWidth + 'px',
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
          <Draggable
            key={asset.id}
            grid={grid}
            bounds={bounds}
            defaultPosition={{ x, y }}
            cancel={'.react-resizable-handle'}
            onDrag={(e, { x, y }) => {
              onDragResize(index, {
                ...element,
                position: { x, y },
              });
            }}
          >
            <ResizableBox
              height={height}
              width={width}
              lockAspectRatio={true}
              resizeHandles={['se']}
              onResize={(event, data) => {
                onDragResize(index, {
                  ...element,
                  height: data.size.height,
                  width: data.size.width,
                });
              }}
            >
              <LayoutCanvasElement element={element} />
            </ResizableBox>
          </Draggable>
        );
      })}
    </div>
  );
};

export default LayoutCanvas;
