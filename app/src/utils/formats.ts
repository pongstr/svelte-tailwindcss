export function fileTypes(files: string, limit = 5): string[] {
  if (!files) return []
  return Object.keys(files)
    .map((item) => files[item].language)
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .splice(0, limit)
}

export function clipDescription(string: string, chars = 77): string {
  return string.length > 0 && string.length > 60
    ? `${string.substring(0, chars)}...`
    : string
}

export function cleanHTML(str: string): string {
  return str.replace(/(<([^>]+)>)/gi, '')
}
