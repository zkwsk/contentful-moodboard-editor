import React from 'react'
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

import { MoodboardElement } from "./Field";

import { MoodboardConfiguration } from "./Field";



// type TextElement = {
//   color: string;
//   text: string;
//   fontSize: number;
//   fontWeight: "regular" | "bold" | "light";
//   fontStyle: "normal" | "italic";
//   backgroundColor: string;
// }

// export type MoodboardElement = MoodboardCommonElement & (Image | TextElement);

export type handleStop = (elementId: string, position: {x: number, y: number }) => void;

export type DraggableFieldProps = {
  element: MoodboardElement;
  moodboardConfiguration: MoodboardConfiguration;
  handleStop: handleStop;
}

function DraggableField({element, moodboardConfiguration, handleStop}: DraggableFieldProps) {

  console.log(element);

  console.log({moodboardConfiguration});

  return (

    <Draggable 
      bounds="parent"
      // grid={
      //   moodboardConfiguration.DEFAULT_GRID ?
      //   [element.grid?.x || moodboardConfiguration.DEFAULT_GRID.x, element.grid?.y || moodboardConfiguration.DEFAULT_GRID.y] :
      //   undefined
      // }
      position={{x: element.position.x, y: element.position.y}}
      // position={{x: 100, y: 100}}
      onStop={(event, position) => { handleStop(element.id, position) }}
      cancel={".react-resizable-handle"}
    >
      <ResizableBox 
        height={300} 
        width={400}
        minConstraints={[30, 40]}
        lockAspectRatio={true}
        // resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
        onResize={(event)=> { console.log(event)} }
      >
        {/* <img src={element.url} title={element.title} alt={element.title} height="100%" width="100%" /> */}
        <div style={{
          border: `1px dashed black`,
          height: "100%",
          width: "100%"
        }} />
      </ResizableBox>
    </Draggable>
  )
}

export default DraggableField;
