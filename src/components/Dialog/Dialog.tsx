import React, { useState } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK, FieldExtensionSDK } from '@contentful/app-sdk';
import LayoutContainer from '../../containers/LayoutContainer';

import { DialogInvocationParams } from '../../types';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = ({ sdk }: DialogProps) => {
  const params = sdk.parameters?.invocation as DialogInvocationParams;

  console.log({ params });

  return <LayoutContainer sdk={sdk} layoutProps={params} />;
};

export default Dialog;
