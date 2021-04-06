import React, { useState, useEffect } from 'react';
import { FieldExtensionSDK, Link } from '@contentful/app-sdk';
import isEqual from "lodash/isEqual";

import './styles.css';

import updateArrayImmutable from '../utils/UpdateArrayImmutable';
import syncronizedState from '../utils/syncronizedState';

import DraggableField from "./DraggableField"
import { handleStop } from "./DraggableField";
import { merge } from 'lodash';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

export type Image = { id: string; type: string; title: string; url: string; width: number; height: number; }

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

export type MoodboardElement = {
  id: string;
  height: string;
  width: string;
  position: {
    x: number;
    y: number;
  };
  grid?: {
    x: number;
    y: number;
  } & Image;
}

const ENTRY_FIELD_ID = 'moodboard';
const IMAGES_FIELD_ID = 'moodboardImages';



const Field = (props: FieldProps) => {
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  const SDK_FIELD = props.sdk.entry.fields[ENTRY_FIELD_ID];


  // const elements: MoodboardElement[] = [
  //   {id: "asjodif", color: "black", height: "20px", width: "20px", position: {x: 20, y: 20}, grid:{x: 10, y: 10}},
  //   {id: "sdfj", color: "blue", height: "20px", width: "20px", position: {x: 60, y: 20}, grid:{x: 10, y: 10}}
  // ]

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
    elements: []
  });

  const [images, setImages] = useState<Image[]>([]);

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
      return true;
    })

    const sdkValue = SDK_FIELD.getValue();
    const sdkEqualsState = isEqual(sdkValue, moodboard);

    // Any time moodboard state is updated persist it to Contentful
    if (!sdkEqualsState) {
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

  const DEFAULT_POSITION_X = 20;
  const DEFAULT_POSITION_Y = 30;

  useEffect(() => {
    const sync = syncronizedState(images, moodboard.elements);
    // @ts-ignore
    const withDefaultValues: MoodboardElement[] = sync.map((item: MoodboardElement) => {
      return {
        ...item,
        position: {
          x: item?.position?.x || DEFAULT_POSITION_X,
          y: item?.position?.x || DEFAULT_POSITION_Y,
        }
      }
    });

    console.log({withDefaultValues});

    const mergedState = {...moodboard, elements: withDefaultValues};

    debugger;

    if (!isEqual(moodboard, mergedState)) {
      debugger;
      setMoodboard(mergedState);
    }
   }, [images, moodboard, moodboard.elements])

  
 
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

  const getImages= ()=> {
    // Grab references to the images
    const imageLinks: Link[] = props.sdk.entry.fields[IMAGES_FIELD_ID]?.getValue();

    if (!imageLinks) {
      return false;
    }
    // Extract IDs
    const imageIds = imageLinks?.map((link) => link.sys?.id);
    
    // console.log({imageLinks})
    // console.log({imageIds})
    
    const images = imageIds?.map(id => props.sdk.space.getAsset(id))

    Promise.all(images).then((data) => {
      const parsedImages = data.map((image: {[prop: string]: any;}): Image => ({
        id: image.sys.id,
        type: "image",
        title: image.fields.title["en-US"],
        url: image.fields.file["en-US"].url,
        width: image.fields.file["en-US"].details.width,
        height: image.fields.file["en-US"].details.height
      }));

      setImages(parsedImages)

    });
  }

  getImages();

  return (
    <>
    <p>{JSON.stringify(images)}</p>
    <div style={{
      width: "100%",
      height: "500px"
    }}>
      {moodboard.elements.map((element: MoodboardElement) => (
        <DraggableField key={element.id} element={element} moodboardConfiguration={moodboard.configuration} handleStop={(elementId, position) => handleStop(elementId, position)} />
      ))}
    </div>
    </>
  );
};

export default Field;
