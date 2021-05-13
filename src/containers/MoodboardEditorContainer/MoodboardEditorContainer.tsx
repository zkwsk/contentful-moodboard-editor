import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownList, DropdownListItem, EntityList, EntityListItem, Paragraph, Typography } from '@contentful/forma-36-react-components';
import {
  FieldExtensionSDK,
  Link,
  EntryFieldAPI,
} from '@contentful/app-sdk';

import { ENTRY_FIELD_ID, ASSETS_FIELD_ID } from '../../constants';

import { Asset } from '../../types';

import objectIsEmpty from "../../utilities/objectIsEmpty";

import { FieldData, Layout } from "../../types";
interface MoodboardEditorContainerProps {
  sdk: FieldExtensionSDK;
}


const MoodboardEditorContainer = ({sdk}: MoodboardEditorContainerProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);

  const entryField = sdk.entry.fields[ENTRY_FIELD_ID];
  const assetField = sdk.entry.fields[ASSETS_FIELD_ID];

  const [fieldData, setFieldData] = useState<FieldData>(
    entryField.getValue() as FieldData,
  );

  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  const layoutIds = entryField ? Object.keys(entryField.getValue()) : [];

  const openDialog = async (options: unknown) => {
    // @ts-ignore
    const updatedLayout = await sdk.dialogs.openCurrentApp(options);
    updatedLayout && saveLayout({ field: entryField, updatedLayout });
  };

  const defaultDialogOptions = {
    width: 'fullWidth',
    minHeight: '90vh',
    parameters: {
      assets,
      entryField: entryField.getValue(),
      layoutIds,
    },
  };

  const handleEdit = async (currentLayoutId: string) => {
    openDialog({
      ...defaultDialogOptions,
      parameters: { ...defaultDialogOptions.parameters, currentLayoutId },
    });
  };

  const handleCreate = async () => {
    openDialog({
      ...defaultDialogOptions,
    });
  };

  const handleRemove = async (id: string, field: EntryFieldAPI) => {
    // TODO: Make a warning alert
    let modified = { ...fieldData };
    delete modified[id];
    setFieldData(modified);
    field.setValue(modified);
  };

  const saveLayout = async ({
    field,
    updatedLayout,
  }: {
    field: EntryFieldAPI;
    updatedLayout: Layout;
  }) => {
    const {
      settings: { layoutId },
    } = updatedLayout;

    await field.setValue({ ...field.getValue(), [layoutId]: updatedLayout });
    setFieldData(field.getValue());
  };

  useEffect(() => {
    // Listen for changes on the asset field.
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
        console.log({ parsedImages });
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
  //   console.log({ assets });
  // }, [assets]);

  useEffect(() => {
    const detach = entryField.onValueChanged(() => {
      sdk.window.updateHeight();
    });
    return () => detach();
  }, [entryField, sdk]);

  const emptyState = (
    <>
      <Card>
        <Typography>
          <Paragraph>
            Please add some assets and at least one layout for the Moodboard to
            display.
          </Paragraph>
        </Typography>
      </Card>
      <Button
        icon="Plus"
        style={{ marginTop: 'var(--spacing-m)' }}
        onClick={() => handleCreate()}
      >
        Add layout
      </Button>
    </>
  );

  return fieldData && Object.keys(fieldData).length >= 0 ? (
    <>
      <EntityList>
        {Object.entries(fieldData).map(
          ([
            id,
            {
              settings: { title },
            },
          ]) => (
            <EntityListItem
              key={id}
              title={title}
              dropdownListElements={
                <DropdownList>
                  <DropdownListItem onClick={() => handleEdit(id)}>
                    Edit
                  </DropdownListItem>
                  <DropdownListItem
                    onClick={() => handleRemove(id, entryField)}
                  >
                    Remove
                  </DropdownListItem>
                </DropdownList>
              }
              onClick={() => handleEdit(id)}
            />
          ),
        )}
      </EntityList>
      <Button
        icon="Plus"
        style={{ marginTop: 'var(--spacing-m)' }}
        onClick={() => handleCreate()}
      >
        Add layout
      </Button>
    </>
  ) : (
    emptyState
  );
};

export default MoodboardEditorContainer;
