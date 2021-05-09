import React, { useEffect, useState, MouseEvent } from 'react';
import { Button, Card, DropdownList, DropdownListItem, EntityList, EntityListItem, Paragraph, Typography } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';

import { ENTRY_FIELD_ID } from '../../constants';

interface MoodboardEditorContainerProps {
  sdk: FieldExtensionSDK;
}

interface LayoutState {
  [key : string]: {
    title: string;
  }
}


const MoodboardEditorContainer = ({sdk}: MoodboardEditorContainerProps) => {

  const SDK_FIELD = sdk.entry.fields[ENTRY_FIELD_ID];

  
  // TODO: load from contentful
  //const [layouts, setLayouts] = useState<LayoutState[]>(SDK_FIELD.getValue() || [{title: "test titles"}]);
  const [layouts, setLayouts] = useState<LayoutState>({ "test-title": {title: "test title"}, "tester-title": {title: "tester title"}});
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/


  const handleEdit = (id: string)=> {
    sdk.dialogs.openCurrentApp({title: "Edit Layout", width: "fullWidth", minHeight: "90vh", parameters:{id}});
  }

  const handleCreate = ()=> {
    sdk.dialogs.openCurrentApp({title: "Create Layout", width: "fullWidth", minHeight: "90vh"});
  }

  const handleRemove = (id: string) => {
    // TODO: Make a warning alert

    let modified = {  ...layouts  };
    delete modified[id];

    setLayouts(modified);
  }

  useEffect(()=> {
    // TODO: Persist state to contentful whenever layouts is updated.
    console.log("Layouts state has been updated");
  }, [layouts])

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
