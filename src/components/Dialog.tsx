import React from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = (props: DialogProps) => {
  return (
    <>
      <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam iure aliquam quisquam nemo autem, alias debitis maiores perspiciatis iusto, assumenda quaerat magnam, accusamus odit! Quam fugit vero dolore delectus vitae!</Paragraph>
      <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat consectetur explicabo nihil inventore nulla ducimus sunt impedit fugiat repellendus, similique aut obcaecati nostrum praesentium a facere nesciunt distinctio. Eligendi, cumque?</Paragraph>
      <Paragraph>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum facere temporibus iure. Amet neque, suscipit quasi sit nemo, mollitia sunt temporibus animi obcaecati sed vel consequatur reprehenderit illo dolores. Quas?</Paragraph>
      <Paragraph>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo ut impedit laboriosam. Magni suscipit ipsam dolore quibusdam accusantium voluptate, atque dolores quas pariatur modi? Iusto debitis numquam facilis quas distinctio.</Paragraph>
      <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis deleniti praesentium quae doloremque ullam pariatur eveniet autem nihil, obcaecati, impedit consequatur eius qui dicta vero, reprehenderit officiis nemo. Sapiente, expedita.</Paragraph>
    </>
  );
};

export default Dialog;
