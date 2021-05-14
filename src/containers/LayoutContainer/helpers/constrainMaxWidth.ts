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
      height,
      width,
    };
  }

  const ratio = constraint / width;

  return {
    height: ratio * height,
    width: ratio * width,
  };
};

export default constrainMaxWidth;
