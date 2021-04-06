import findListDifference from './findListDifference';
import updateArrayImmutable from './UpdateArrayImmutable';

type ObjectWithId = {
  id: string;
} & {
  [prop: string]: unknown;
}
// {[prop: string]: any;}

const syncronizedState = (imagesList: ObjectWithId[], localState: ObjectWithId[]) => {
  // These elements are present on source list but not destination
  const newElements = findListDifference(imagesList, localState, "id");
  // This is the local state plus the new elements. By retaining
  const temp = [...localState, ...newElements];
  const itemsToBeDeleted = findListDifference(temp, imagesList, "id");

  itemsToBeDeleted.forEach((item) => {
    // @ts-ignore
    const id = temp.findIndex((element) => element.id === item.id);
    updateArrayImmutable(temp, id);
  });
  return [...temp];
}

export default syncronizedState;