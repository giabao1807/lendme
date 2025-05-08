export interface SortItem {
  name: string;
}

export const sort = <T extends SortItem>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
};
