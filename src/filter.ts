import { getConfig } from "./utils/config.js";
import { getFilters } from "./utils/getFilters.js";
import * as pandoc from "pandoc-filter";
import { frontMatter } from "./utils/frontMatter.js";
import type { Filter } from "./index.js";

type Meta = { c: pandoc.Elt<"Str">[] };

const processMetaFilters = (metaFilters: Meta[]) =>
  metaFilters.map((entry) => entry.c.reduce((acc, cur) => acc + cur.c, ""));

async function main() {
  const config = getConfig();
  const filters = (await getFilters(config.filterDir)).map((Filter) => new Filter());

  const conditional = filters.filter((filter) => filter.activation !== "always");

  const filterFns = filters.filter((filter) => filter.activation === "always");

  let firstTimeSetup = true;
  pandoc.stdio(async (ele, format, meta) => {
    if (firstTimeSetup) {
      const filterNames = processMetaFilters((meta?.filters?.c ?? []) as Meta[]);
      const nameToFilter = conditional.reduce<Record<string, Filter>>((acc, cur) => {
        acc[(cur.activation as { yamlFilter: string }).yamlFilter] = cur;
        return acc;
      }, {});
      for (const name of filterNames)
        if (name in nameToFilter) filterFns.push(nameToFilter[name]);
        else throw new Error(`Filter ${name} not found`);

      // set format and meta
      for (const filter of filterFns) {
        // @ts-expect-error - I know it's private, but that's *public* API
        filter._format = format;
        // @ts-expect-error - ditto
        filter._meta = meta;
        // @ts-expect-error - ditto
        filter._frontmatter = frontMatter.get();
      }
      firstTimeSetup = false;
    }

    let responses = [];

    for (const filter of filterFns) {
      const response = await filter.filter(ele);
      if (response) responses.push(response);
    }
    if (responses.length) return responses.flat();
  });
}
main();
