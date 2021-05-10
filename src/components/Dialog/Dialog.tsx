import React, { useState } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK, FieldExtensionSDK } from '@contentful/app-sdk';
import LayoutContainer from '../../containers/LayoutContainer';

import { Image, Layout } from '../../types';

interface DialogProps {
  sdk: DialogExtensionSDK;
}
interface InvocationParams {
  id?: string;
  // layoutField: Layout;
  assets: Image[];
}

const Dialog = ({ sdk }: DialogProps) => {
  const params = sdk.parameters?.invocation as InvocationParams;
  let layoutId = params.id;
  // const fieldSdk = params.fieldSdk;

  // debugger;

  console.log({ params });

  return <LayoutContainer sdk={sdk} layoutId={layoutId} />;
};

export default Dialog;
