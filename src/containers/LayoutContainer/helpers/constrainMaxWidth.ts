const constrainMaxWidth = ({
  width,
  height,
  constraint,
}: {
  height: number;
  width: number;
  constraint: number;
}) => {
  if (width < constraint) {
    return {
      maxHeight: height,
      maxWidth: width,
    };
  }

  const ratio = constraint / width;

  return {
    maxWidth: ratio * width,
    maxHeight: ratio * height,
  };
};

export default constrainMaxWidth;
