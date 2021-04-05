import React from 'react'
import Draggable from "react-draggable";

import { MoodboardConfiguration } from "./Field";

export type MoodboardElement = {
  id: string;
  color: string;
  height: string;
  width: string;
  position: {
      x: number;
      y: number;
  };
  grid?: {
      x: number;
      y: number;
  };
}

export type handleStop = (elementId: string, position: {x: number, y: number }) => void;

export type DraggableFieldProps = {
  element: MoodboardElement;
  moodboardConfiguration: MoodboardConfiguration;
  handleStop: handleStop;
}

function DraggableField({element, moodboardConfiguration, handleStop}: DraggableFieldProps) {

  return (
        <Draggable 
          bounds="parent"
          grid={
            moodboardConfiguration.DEFAULT_GRID ?
            [element.grid?.x || moodboardConfiguration.DEFAULT_GRID.x, element.grid?.y || moodboardConfiguration.DEFAULT_GRID.y] :
            undefined
          }
          position={{x: element.position.x, y: element.position.y}}
          onStop={(event, position) => { handleStop(element.id, position) }}
        >
          <div style={{
  backgroundColor: element.color,
            height: element.height,
            width: element.width
          }}></div>
        </Draggable>
  )
}

export default DraggableField;
