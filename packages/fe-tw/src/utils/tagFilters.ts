export function tokenize(str: string): string[] {
  return str.toLowerCase().match(/[a-z0-9\-]+/g) ?? [];
}

export function getSliceTags(sliceName: string): string[] {
  return tokenize(sliceName);
}

export function getBuildingTags(building: any): string[] {
  const tags = new Set<string>();
  tokenize(building.info.demographics.location).forEach((t) => tags.add(t));
  tokenize(building.info.demographics.locationType).forEach((t) => tags.add(t));
  tokenize(building.info.demographics.type).forEach((t) => tags.add(t));
  return Array.from(tags);
}

export function buildingMatchesSlice(
  buildingTags: string[],
  sliceTags: string[],
): boolean {
  const buildingSet = new Set(buildingTags);
  return sliceTags.every((tag) => buildingSet.has(tag));
}
