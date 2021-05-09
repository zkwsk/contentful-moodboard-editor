import { Link } from '@contentful/app-sdk';

import { FieldExtensionSDK } from '@contentful/app-sdk';

import { Image } from '../../types';

export type GetImagesProps = {
  sdk: FieldExtensionSDK;
  fieldId: string;
};

const getImages = ({ sdk, fieldId }: GetImagesProps) => {
  // Grab references to the images
  const imageLinks: Link[] = sdk.entry.fields[fieldId]?.getValue();

  if (!imageLinks) {
    return false;
  }
  // Extract IDs
  const imageIds = imageLinks?.map((link) => link.sys?.id);

  // console.log({imageLinks})
  // console.log({imageIds})

  const images = imageIds?.map((id) => sdk.space.getAsset(id));

  Promise.all(images).then((data) => {
    const parsedImages = data.map(
      (image: { [prop: string]: any }): Image => ({
        id: image.sys.id,
        type: 'image',
        title: image.fields.title['en-US'],
        url: image.fields.file['en-US'].url,
        width: image.fields.file['en-US'].details.width,
        height: image.fields.file['en-US'].details.height,
      }),
    );

    console.log({ parsedImages });

    // setImages(parsedImages);
  });
};

export default getImages;
