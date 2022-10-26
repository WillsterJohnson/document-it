export function limitLength(source: string, trim: "start" | "end", length: number) {
  if (source.length > length) {
    if (trim === "start") return `...${source.slice(3 - length)}`;
    else return `${source.slice(0, length - 3)}...`;
  }
  return source;
}
