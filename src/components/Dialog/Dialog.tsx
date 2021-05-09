import React, { useState } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import LayoutContainer from '../../containers/LayoutContainer';

interface DialogProps {
  sdk: DialogExtensionSDK;
}
interface InvocationParams {
  id?: string;
}

const Dialog = ({ sdk }: DialogProps) => {
  const params = sdk.parameters?.invocation as InvocationParams;
  let layoutId = params.id;

  return <LayoutContainer sdk={sdk} layoutId={layoutId} />;
};

export default Dialog;
