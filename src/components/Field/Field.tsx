import React, { useState } from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import MoodboardEditorContainer from '../../containers/MoodboardEditorContainer';
import { JsonEditor } from '@contentful/field-editor-json';
import { CheckboxField } from '@contentful/forma-36-react-components';

import '@contentful/forma-36-react-components/dist/styles.css';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  const [development, setDevelopment] = useState(false);

  return (
    <>
      <MoodboardEditorContainer sdk={props.sdk} />
      <div style={{ marginTop: 'var(--spacing-m)' }}>
        <CheckboxField
          name="enableJson"
          id="enableJson"
          labelText="Enable JSON view"
          helpText="Shows generated JSON for debugging and development."
          checked={development}
          onChange={(event) => {
            // Since checkboxes don't have a onBlur we update state directly
            // on the parent component which will in turn push the updated
            // state back to this component.
            setDevelopment(!development);
            setTimeout(() => {
              props.sdk.window.updateHeight();
            }, 100);
          }}
        />
        {development && (
          <JsonEditor field={props.sdk.field} isInitiallyDisabled />
        )}
      </div>
    </>
  );
};

export default Field;
