const updateArrayImmutable = (list: unknown[], indexToUpdate: number, updatedValue: unknown) => {
  list.splice(indexToUpdate, 1, updatedValue);
  return [...list];
}

export default updateArrayImmutable;