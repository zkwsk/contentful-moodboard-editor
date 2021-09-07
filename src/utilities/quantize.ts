/**
 * Quantize values to the nearest value divisible with quantizeValue.
 * If quantizeValue is set to 0 no quantization will happen.
 *
 * @param input number
 * @param quantizeValue number
 * @returns number
 */
const quantize = (input: number, quantizeValue: number): number => {
  if (quantizeValue === 0) {
    return input;
  }
  return Math.round(input / quantizeValue) * quantizeValue;
};

export default quantize;
