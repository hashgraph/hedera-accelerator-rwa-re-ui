export function slugify(input: string) {
  return input.toLowerCase().replace(/\s+/g, "-");
}
