import React, {useEffect} from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import MoodboardEditorContainer from '../../containers/MoodboardEditorContainer';
import { JsonEditor } from '@contentful/field-editor-json';

import '@contentful/forma-36-react-components/dist/styles.css';


interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  return (
    <>
      <MoodboardEditorContainer sdk={props.sdk} />
      <div style={{ marginTop: 'var(--spacing-m)' }}>
        <JsonEditor field={props.sdk.field} isInitiallyDisabled />
      </div>
    </>
  );
};;

export default Field;
