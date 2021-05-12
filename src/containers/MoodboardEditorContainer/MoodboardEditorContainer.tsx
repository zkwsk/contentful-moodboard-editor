import React, { useEffect, useState, MouseEvent } from 'react';
import { Button, Card, DropdownList, DropdownListItem, EntityList, EntityListItem, Paragraph, Typography } from '@contentful/forma-36-react-components';
import {
  OpenCustomWidgetOptions,
  FieldExtensionSDK,
  Link,
  EntryFieldAPI,
} from '@contentful/app-sdk';

import { ENTRY_FIELD_ID, ASSETS_FIELD_ID } from '../../constants';

import { Asset, DialogInvocationParams, Image, Video } from '../../types';

import objectIsEmpty from "../../utilities/objectIsEmpty";

import { FieldData, Layout } from "../../types";
interface MoodboardEditorContainerProps {
  sdk: FieldExtensionSDK;
}


const MoodboardEditorContainer = ({sdk}: MoodboardEditorContainerProps) => {

  const [assets, setAssets] = useState<Asset[]>([]);


  const entryField = sdk.entry.fields[ENTRY_FIELD_ID];
  const assetField = sdk.entry.fields[ASSETS_FIELD_ID];


  // getAssets({ sdk, callback: setAssets });

  const testInitialState = {
    'test-1': {
      settings: {
        layoutId: 'test-1',
        title: 'Test 1',
        enabled: true,
        aspectRatio: '3:5',
        maxWidth: 0,
        isValid: true,
      },
      elements: [
        {
          published: true,
          height: 480,
          width: 640,
          originalHeight: 480,
          originalWidth: 640,
          top: 20,
          left: 45,
          element: {
            id: 'fjfklsfkj',
            filename: 'bogus.jpg',
            title: 'Test image',
            type: 'image/jpeg',
            width: 640,
            height: 480,
            element: {
              url: 'https://fakeimg.pl/640x480',
              alt: "This is fake",
              description: "A fake image"
            },
          },
        },
      ],
    },
  };
  
  // Reset state
  // entryField.setValue(testInitialState);

  // TODO: load from contentful
  const [fieldData, setFieldData] = useState<FieldData>(
    entryField.getValue() as FieldData,
  );
  
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  const layoutIds = entryField ? Object.keys(entryField) : [];

  const dialogParameters = {
    assets,
    entryField: entryField.getValue(),
    layoutIds
  };


  const openDialog = async (options: unknown) => {
    // @ts-ignore
    const updatedLayout = await sdk.dialogs.openCurrentApp(options);
    updatedLayout && saveLayout({field: entryField, updatedLayout });
  };

  const handleEdit = async (currentLayoutId: string) => {
    openDialog({
      // title: 'Edit Layout',
      width: 'fullWidth',
      minHeight: '90vh',
      parameters: { ...dialogParameters, currentLayoutId },
    });
  };

  const handleCreate = async () => {
    // const saved = await sdk.dialogs.openCurrentApp({
    //   title: 'Create Layout',
    //   width: 'fullWidth',
    //   minHeight: '90vh',
    //   parameters: dialogParameters,
    // });
    openDialog({
      width: 'fullWidth',
      minHeight: '90vh',
      parameters: dialogParameters,
    });
  };

  const handleRemove = (id: string) => {
    // TODO: Make a warning alert
    let modified = { ...fieldData };
    delete modified[id];

    setFieldData(modified);
  }

  const saveLayout = ({field, updatedLayout }: { field: EntryFieldAPI; updatedLayout: Layout;})=> {


    const {settings:{layoutId}} = updatedLayout;

    field.setValue({ ...field.getValue(), [layoutId]: updatedLayout });
  }

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

      // Get assets via the SDK
      const assetPromises = imageIds?.map((id) => sdk.space.getAsset(id));

      Promise.all(assetPromises).then((data) => {
        const filteredData = data.filter((asset: { [prop: string]: any }) => {
          return !objectIsEmpty(asset.fields);
        });

        const parsedImages = filteredData.map(
          (asset: { [prop: string]: any }): Asset => {
            const type = asset.fields.file['en-US'].contentType;
            const filename = asset.fields.file['en-US'].fileName;
            const title = asset.fields.title['en-US'];
            const width =
              asset.fields.file['en-US'].details.image?.width || 1920;
            const height =
              asset.fields.file['en-US'].details.image?.height || 1080;

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
          },
        );
        setAssets(parsedImages);
      });
    });
    return () => detach();
  }, [assetField, sdk]);

  // useEffect(()=> {
  //   // TODO: Persist state to contentful whenever layouts is updated.
  //   console.log("Layouts state has been updated");
  // }, [fieldData])

  // useEffect(() => {
  //   console.log({ assets } );
  // }, [assets]);

  const emptyState = (
    <Card>
      <Typography>
        <Paragraph>Please add some assets and at least one layout for the Moodboard to display.</Paragraph>
      </Typography>
    </Card>
  )

  return fieldData && Object.keys(fieldData).length >= 0 ? (
    <>
      <EntityList>
        {Object.entries(fieldData).map(([id, {settings: {title}}]) => (
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
