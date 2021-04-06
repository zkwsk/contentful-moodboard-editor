/**
 * Find elements that are present on the source list but not the
 * destination list.
 * 
 * @param source 
 * @param destination 
 * @param attribute 
 * @returns 
 */
const findListDifference = (source: unknown[], destination: unknown[], attribute: string) => {
  return source.filter((sourceElement) => {
    return !destination.find((destinationElement) => {
      // @ts-ignore
      return destinationElement[attribute] === sourceElement[attribute]
    });
  });
}

export default findListDifference;