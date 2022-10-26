import { JSONLoader } from "./jsonLoader.js";

export interface Config {
  /**
   * Where user-created filters are stored
   *
   * @default "filters"
   */
  filterDir: string;
  /**
   * Where your source documents are stored.
   *
   * Throws an error if this is the same as `outputDir`.
   *
   * @default "documents"
   */
  sourceDir: string;
  /**
   * The extension of your source documents.
   *
   * @default ["md"]
   */
  sourceExt: string[];
  /**
   * Where your output documents are stored.
   *
   * Throws an error if this is the same as `sourceDir`.
   *
   * @default "output"
   */
  outputDir: string;
}

const CONFIG_FILE_NAMES = [".documentitrc", ".documentitrc.json", ".docitrc", ".docit.json"];
const defaultConfig: Config = {
  filterDir: "filters",
  sourceDir: "documents",
  sourceExt: ["md"],
  outputDir: "output",
};

export function getConfig(): Config {
  const argv = process.argv.slice(2);

  const filterDir = argv.find((arg) => arg.startsWith("--filterDir="))?.split("=")[1];
  const sourceDir = argv.find((arg) => arg.startsWith("--sourceDir="))?.split("=")[1];
  const sourceExt = argv
    .find((arg) => arg.startsWith("--sourceExt="))
    ?.split("=")[1]
    ?.split(",");
  const outputDir = argv.find((arg) => arg.startsWith("--outputDir="))?.split("=")[1];

  const commandLine: Partial<Config> = {};

  if (filterDir) commandLine.filterDir = filterDir;
  if (sourceDir) commandLine.sourceDir = sourceDir;
  if (sourceExt) commandLine.sourceExt = sourceExt;
  if (outputDir) commandLine.outputDir = outputDir;

  let config = null;
  for (const fName of CONFIG_FILE_NAMES) if ((config = JSONLoader<Config>(fName))) break;
  return { ...defaultConfig, ...config, ...commandLine };
}
