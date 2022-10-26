import path from "node:path";
import { AnyElt } from "pandoc-filter";
import { Filter } from "../index.js";
import { walkDir } from "./walkDir.js";

declare class BaseFilter extends Filter {
  public activation: { yamlFilter: string } | "always";
  public filter(ele: AnyElt): void | (AnyElt | AnyElt[]) | Promise<void | (AnyElt | AnyElt[])>;
}

const prefixMsg = ` (prefix the file or one of it's parent directories with \`_\` to ignore it)`;

export async function getFilters(filterDir: string) {
  const filters: typeof BaseFilter[] = [];
  await walkDir(filterDir, async (filePath) => {
    const filePathRel = path.relative(process.cwd(), filePath);
    if (filePathRel.split(path.sep).some((segment) => segment.startsWith("_"))) return;
    if (filePathRel.endsWith(".js") || filePathRel.endsWith(".cjs")) {
      try {
        const filter = await import(path.join(process.cwd(), filePath));
        const filterClass = filter.default;
        // if default export is valid filter, add to classes
        if (filterClass.prototype instanceof Filter) filters.push(filterClass);
        // else, throw error
        else {
          const err = Error(
            `Filter ${filePathRel} does not provide a default extending the \`Filter\` class`,
          );
          err.name = "InvalidFilter";
          throw err;
        }
      } catch (cause) {
        if (cause instanceof Error && cause.name === "InvalidFilter") throw cause;
        throw new Error(`Error importing filter ${filePathRel}` + prefixMsg, { cause });
      }
    }
    // if file is mjs, throw error
    else if (filePathRel.endsWith(".mjs")) {
      throw new Error(
        `Filter ${filePathRel} is an ES module, but only CommonJS modules are supported` +
          prefixMsg,
      );
    }
  });
  return filters;
}
