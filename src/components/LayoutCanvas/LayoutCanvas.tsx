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

  return (
    <>
      {publishedElements.map((element, index) => {
        const { height, width, position, asset } = element;
        return (
          <ResizableBox
            key={asset.id}
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
                backgroundColor: 'hotpink',
                width: '100%',
                height: '100%',
                border: '2px solid black',
              }}
            >
              {/* <img src={asset.element.url} /> */}
            </div>
          </ResizableBox>
        );
      })}
    </>
  );

  // return (
  //   {publishedElements.map(element => (
  //   <Draggable
  //     bounds="parent"
  //     // grid={
  //     //   moodboardConfiguration.DEFAULT_GRID ?
  //     //   [element.grid?.x || moodboardConfiguration.DEFAULT_GRID.x, element.grid?.y || moodboardConfiguration.DEFAULT_GRID.y] :
  //     //   undefined
  //     // }
  //     position={{ x: element.position.x, y: element.position.y }}
  //     // position={{x: 100, y: 100}}
  //     onStop={(event, position) => {
  //       handleStop(element.id, position);
  //     }}
  //     cancel={'.react-resizable-handle'}
  //   >
  //     <ResizableBox
  //       height={300}
  //       width={400}
  //       minConstraints={[30, 40]}
  //       lockAspectRatio={true}
  //       // resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
  //       onResize={(event) => {
  //         console.log(event);
  //       }}
  //     >
  //       {/* <img src={element.url} title={element.title} alt={element.title} height="100%" width="100%" /> */}
  //       <div
  //         style={{
  //           border: `1px dashed black`,
  //           height: '100%',
  //           width: '100%',
  //         }}
  //       />
  //     </ResizableBox>
  //   </Draggable>
  // )))}
};

export default LayoutCanvas;
