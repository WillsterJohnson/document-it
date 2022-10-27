import child from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { limitLength } from "./limitLength.js";

export interface PandocParams {
  /**
   * The source file to convert.
   */
  sourceFile: string;
  /**
   * The target format for conversion.
   *
   * You may also pass an engine, e.g., `pdflatex`.
   *
   * @example
   * ```ts
   * PandocParams.targetFormat = "html";
   * PandocParams.targetFormat = "pdf";
   * ```
   */
  targetFormat: string;
  /**
   * The output file or directory to write to.
   *
   * Defaults to the input file, with the extension replaced by the target format
   */
  targetDestination?: string;
  /**
   * Sets the Table Of Contents (toc) depth.
   * Also implies generating a toc.
   *
   * Setting to `0` will disable the toc.
   * @default 0
   */
  tocDepth?: number;
  /**
   * Produces a standalone document.
   */
  standalone?: boolean;
  /**
   * The filter file(s) to use.
   */
  filter?: string[];
  /**
   * Lua filter file(s) to use.
   */
  luaFilter?: string[];
}

/**
 * Run the given string as a console command.
 */
const command = (...cmd: string[]) => child.execSync(cmd.join(" ")).toString();

export function pandoc(params: PandocParams, ...additionalCliArgs: string[]) {
  const cliArgs = [`"${params.sourceFile}"`];
  // TARGET FILE
  let out = "";
  // source file w/o extension
  const noExtSrc = params.sourceFile.split(".").slice(0, -1).join(".");
  // if target provided, use it
  if (params.targetDestination) {
    out += params.targetDestination;
    // if target ends with a slash, assume it's a directory
    if (
      fs.existsSync(params.targetDestination) &&
      fs.statSync(params.targetDestination).isDirectory()
    ) {
      out = path.join(out, `${noExtSrc.split("/").slice(-1)[0]}.${params.targetFormat}`);
    }
  }
  // if target is dir, or is not given, add constructed filename
  else out += `${noExtSrc}.${params.targetFormat}`;
  cliArgs.push(`-o "${out}"`);

  // TOC
  if (params.tocDepth) cliArgs.push(`--toc --toc-depth=${params.tocDepth}`);

  // STANDALONE
  if (params.standalone) cliArgs.push("--standalone");

  // FILTER
  if (params.filter) cliArgs.push(...params.filter.map((f) => `--filter "${f}"`));
  if (params.luaFilter) cliArgs.push(...params.luaFilter.map((f) => `--lua-filter "${f}"`));

  // limit params.sourceFile to it's last 17 characters
  const limitedSrc = limitLength(params.sourceFile, "start", 20);
  console.log(`Converting ${limitedSrc} to ${params.targetFormat.toUpperCase()}...`);
  command("pandoc", ...cliArgs, ...additionalCliArgs);
}
