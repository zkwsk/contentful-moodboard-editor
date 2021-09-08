const aspectRatioToDecimal = (aspectRatio: [number, number]): number => {
  const [x, y] = aspectRatio;
  return x / y;
};

export default aspectRatioToDecimal;
