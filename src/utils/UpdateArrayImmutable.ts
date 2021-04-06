const updateArrayImmutable = (list: unknown[], indexToUpdate: number, updatedValue?: unknown) => {
  if (updatedValue) {
    list.splice(indexToUpdate, 1, updatedValue);
  } else {
    list.splice(indexToUpdate, 1);
  }
  
  return [...list];
}

export default updateArrayImmutable;