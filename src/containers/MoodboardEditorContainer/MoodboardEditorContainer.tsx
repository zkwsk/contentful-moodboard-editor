import React, { useEffect, useState, MouseEvent } from 'react';
import { Button, Card, DropdownList, DropdownListItem, EntityList, EntityListItem, Paragraph, Typography } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK, Link } from '@contentful/app-sdk';

import { ENTRY_FIELD_ID, ASSETS_FIELD_ID } from '../../constants';

import { Asset, Image, Video } from '../../types';

import objectIsEmpty from "../../utilities/objectIsEmpty";

interface MoodboardEditorContainerProps {
  sdk: FieldExtensionSDK;
}

interface LayoutState {
  [key : string]: {
    title: string;
  }
}


const MoodboardEditorContainer = ({sdk}: MoodboardEditorContainerProps) => {

  const [assets, setAssets] = useState<Asset[]>([]);

  const entryField = sdk.entry.fields[ENTRY_FIELD_ID];
  const assetField = sdk.entry.fields[ASSETS_FIELD_ID];


  // getAssets({ sdk, callback: setAssets });

  
  // TODO: load from contentful
  //const [layouts, setLayouts] = useState<LayoutState[]>(entryField.getValue() || [{title: "test titles"}]);
  const [layouts, setLayouts] = useState<LayoutState>({ "test-title": {title: "test title"}, "tester-title": {title: "tester title"}});
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/


  const dialogParameters = {
    assets,
    // entryField // Probably just needs .getValue()
  };

  const handleEdit = (id: string)=> {
    sdk.dialogs.openCurrentApp({
      title: 'Edit Layout',
      width: 'fullWidth',
      minHeight: '90vh',
      parameters: { ...dialogParameters, id },
    });
  }

  const handleCreate = ()=> {
    sdk.dialogs.openCurrentApp({
      title: 'Create Layout',
      width: 'fullWidth',
      minHeight: '90vh',
      parameters: dialogParameters
    });
  }

  const handleRemove = (id: string) => {
    // TODO: Make a warning alert

    let modified = {  ...layouts  };
    delete modified[id];

    setLayouts(modified);
  }

  // useEffect(() => {
  //   // Callback for changes of the field value.
  //   const detachValueChangeHandler = assetField.onValueChanged((value) => {
  //     console.log({ value });
  //   });

  //   return () => {
  //     detachValueChangeHandler();
  //   };
  // }, [assetField]);


  useEffect(() => {
    const detach = assetField.onValueChanged((value) => {
      if (!sdk) {
        return;
      }
      // Grab references to the images
      const imageLinks: Link[] = sdk.entry.fields[ASSETS_FIELD_ID]?.getValue();

      if (!imageLinks) {
        return;
      }
      // Extract IDs
      const imageIds = imageLinks?.map((link) => link.sys?.id);

      // console.log({imageLinks})
      // console.log({imageIds})

      const assetPromises = imageIds?.map((id) => sdk.space.getAsset(id));

      Promise.all(assetPromises).then((data) => {
        // const parsedImages = data.map(
        //   (image: { [prop: string]: any }): Image => ({
        //     id: image.sys.id,
        //     type: image.fields.file['en-US'].url.startsWith('//images')
        //       ? 'image'
        //       : 'video',
        //     title: image.fields.title['en-US'],
        //     url: image.fields.file['en-US'].url,
        //     width: image.fields.file['en-US'].details.width,
        //     height: image.fields.file['en-US'].details.height,
        //   }),
        // );
          const filteredData = data.filter((asset: { [prop: string]: any }) => {
            return !(objectIsEmpty(asset.fields));
          })

          const parsedImages = filteredData.map((asset: { [prop: string]: any }): Asset => {
              const type = asset.fields.file['en-US'].contentType;
              const filename = asset.fields.file['en-US'].fileName;
              const title = asset.fields.title['en-US'];
              const width = asset.fields.file['en-US'].details.image?.width || 1920; 
              const height = asset.fields.file['en-US'].details.image?.height || 1080;

              return {
                id: asset.sys.id,
                filename,
                title,
                type,
                width,
                height,
                element: {
                  description: asset.fields.description?.['en-US'],
                  url: asset.fields.file['en-US'].url,
                },
              };
            });
        setAssets(parsedImages);
      });
    });
    return () => detach();
  }, [assetField, sdk]);

  useEffect(()=> {
    // TODO: Persist state to contentful whenever layouts is updated.
    console.log("Layouts state has been updated");
  }, [layouts])

  useEffect(() => {
    console.log({ assets });
  }, [assets]);

  const emptyState = (
    <Card>
      <Typography>
        <Paragraph>Please add some assets and at least one layout for the Moodboard to display.</Paragraph>
      </Typography>
    </Card>
  )

  return Object.keys(layouts).length >= 0 ? (
    <>
      <EntityList>
        {Object.entries(layouts).map(([id, {title}]) => (
          <EntityListItem key={id} title={title} dropdownListElements={
            <DropdownList>
              <DropdownListItem onClick={() => handleEdit(id)}>Edit</DropdownListItem>
              <DropdownListItem onClick={() => handleRemove(id)}>Remove</DropdownListItem>
            </DropdownList>
            }
            onClick={() => handleEdit(id)}
          />)
        )}
      </EntityList>
      <Button icon="Plus" style={{marginTop: "var(--spacing-m)"}} onClick={() => handleCreate()}>Add layout</Button>
    </>
  ) : emptyState
};

export default MoodboardEditorContainer;
