const parseAspectRatio = (aspectRatio: string): [number, number] => {
  const tuple = aspectRatio.split(':').map((element) => parseInt(element, 10));

  if (!tuple || tuple.length !== 2) {
    throw new Error('Cannot parse ratio');
  }

  return tuple as [number, number];
};

export default parseAspectRatio;
