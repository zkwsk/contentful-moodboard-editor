import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Draggable as DraggableType, Layout } from '../../types';

import 'react-resizable/css/styles.css';

type LayoutCanvasProps = {
  layout: Layout;
  onDragResize: (index: number, value: DraggableType) => void;
};

const LayoutCanvas = ({ layout, onDragResize }: LayoutCanvasProps) => {
  const { elements, settings } = layout;
  const publishedElements = elements.filter(({ published }) => published);

  console.log({ publishedElements });

  const [aspectX, aspectY] = settings.aspectRatio.split(':').map(element => parseInt(element, 10)) as [number, number];

  const aspect = aspectX / aspectY;
  const aspectPercent = (aspectY / aspectX) * 100 + '%';

  // TODO: Disabled. Currently bounds are offset by the previous elements height
  const bounds = false && {
    top: 0,
    left: 0
  }

  return (
    <div style={{border: "1px dotted black", height: 0, paddingBottom: aspectPercent}}>
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
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${asset.element.url})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: 'contain',
                }}
              ></div>
            </ResizableBox>
          </Draggable>
        );
      })}
    </div>
  );
};

export default LayoutCanvas;
