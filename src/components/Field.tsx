import React, { useState, useEffect } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import isEqual from "lodash/isEqual";

import updateArrayImmutable from '../utils/UpdateArrayImmutable';

import DraggableField from "./DraggableField"
import {MoodboardElement, handleStop} from "./DraggableField";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

export type MoodboardConfiguration = {
  HEIGHT: number;
  DEFAULT_GRID?: {
    x: number;
    y: number;
  }
}

export type MoodbardState = {
  elements: MoodboardElement[] &
  MoodboardConfiguration
}

const CONTENT_FIELD_ID = 'moodboard';

const Field = (props: FieldProps) => {
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  const SDK_FIELD = props.sdk.entry.fields[CONTENT_FIELD_ID];


  const elements: MoodboardElement[] = [
    {id: "asjodif", color: "black", height: "20px", width: "20px", position: {x: 20, y: 20}, grid:{x: 10, y: 10}},
    {id: "sdfj", color: "blue", height: "20px", width: "20px", position: {x: 60, y: 20}, grid:{x: 10, y: 10}}
  ]

  // TODO: initialize from contentful
  const [moodboard, setMoodboard] = useState(SDK_FIELD.getValue() || {
    configuration: {
      HEIGHT: 0,
      // TODO: Reintroduce grid later
      // DEFAULT_GRID: {
      //   x: 20,
      //   y: 20
      // }
    },
    elements: [...elements]
  });

  const handleStop: handleStop = async (elementId, position) => {
    const indexToUpdate = moodboard.elements.findIndex((element: MoodboardElement) => element.id === elementId);

    const updatedElement = {
      ...moodboard.elements[indexToUpdate],
      position: {
        x: position.x,
        y: position.y
      }
    }

    await setMoodboard({
      ...moodboard,
      elements: [
        ...updateArrayImmutable(moodboard.elements, indexToUpdate, updatedElement) as MoodboardElement[]
      ]
    })
  }

  useEffect(() => {
    moodboard?.elements.map((element: MoodboardElement) => {
      console.log(`Element with color: ${element.color} is at position x: ${element.position.x} y: ${element.position.y}`)
      return true;
    })
    console.log({moodboard})

    const sdkValue = SDK_FIELD.getValue();

    const sdkEqualsState = isEqual(sdkValue, moodboard);

    console.log({sdkEqualsState});

    // Any time moodboard state is updated persist it to Contentful
    if (!sdkEqualsState) {
      console.log('Setting')
      SDK_FIELD.setValue(moodboard);
    }
  }, [moodboard, SDK_FIELD])

  useEffect(() => {
    // TODO: Not currently listening for changes to SDK_FIELD
    if (false) {
      SDK_FIELD.onValueChanged((event) => {
        if (!isEqual(moodboard, SDK_FIELD.getValue())) {
          setMoodboard(SDK_FIELD.getValue());
        }
      })
    }
  }, [SDK_FIELD, moodboard]);
 
  // Runs on the first mount only
  useEffect(() => {

    // Populate state from Contentful
    SDK_FIELD.getValue() ?? setMoodboard(SDK_FIELD.getValue());

    // Resize iframe to extension automatically
    props.sdk.window.startAutoResizer();

    return function cleanup() {
      props.sdk.window.stopAutoResizer();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  if (!SDK_FIELD) {
    return null;
  }

  return (
    <div style={{
      width: "100%",
      height: "500px",
      backgroundColor: "#cecece"
    }}>
      <Paragraph>Hello Entry Field Component</Paragraph>
      {moodboard.elements.map((element: MoodboardElement) => (
        <DraggableField key={element.id} element={element} moodboardConfiguration={moodboard.configuration} handleStop={(elementId, position) => handleStop(elementId, position)} />
      ))}
    </div>
  );
};

export default Field;
