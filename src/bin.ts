#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { type Config, getConfig } from "./utils/config.js";
import { frontMatter } from "./utils/frontMatter.js";
import { hash } from "./utils/hash.js";
import { JSONLoader } from "./utils/jsonLoader.js";
import { limitLength } from "./utils/limitLength.js";
import { pandoc } from "./utils/pandoc.js";
import { walkDir } from "./utils/walkDir.js";

const commands = {
  convert: async () => {
    const config: Config = getConfig();
    const hashes = JSONLoader(path.join(config.outputDir, ".document-it")) ?? {};
    let conversions = 0;
    let skipped = 0;
    let deletions = 0;
    await walkDir(config.sourceDir, async (filePath) => {
      const shortPath = limitLength(path.relative(process.cwd(), filePath), "start", 20);
      const ext = path.extname(filePath).slice(1);
      if (config.sourceExt.includes(ext)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const fileHash = hash(content);
        if (hashes[filePath] === fileHash) {
          console.log(`Skipping ${shortPath}: content unchanged`);
          skipped++;
          return;
        }
        const target = path.join(
          config.outputDir,
          path.relative(path.join(process.cwd(), config.sourceDir), path.dirname(filePath)),
        );
        frontMatter.set(YAML.parse(content.split("---")[1]));
        fs.mkdirSync(target, { recursive: true });
        for (const format of frontMatter.data.outputExt ?? ["pdf", "docx"])
          pandoc({
            sourceFile: filePath,
            targetFormat: format,
            filter: [path.relative(process.cwd(), path.join(__dirname, "./filter.js"))],
            standalone: frontMatter.data.standalone ?? true,
            targetDestination: target,
            tocDepth: frontMatter.data.tocDepth ?? 2,
          });
        hashes[filePath] = fileHash;
        conversions++;
      }
    });
    for (const key in hashes) {
      if (!fs.existsSync(key)) {
        const target = path.join(
          config.outputDir,
          path.dirname(path.relative(path.join(config.sourceDir), key)),
          path.basename(key, path.extname(key)),
        );
        await walkDir(
          path.dirname(target),
          (filePath) => {
            const re = new RegExp(`^${path.basename(key, path.extname(key))}\\.[a-z]+$`);
            if (path.basename(filePath).match(re)) fs.rmSync(filePath);
          },
          false,
        );
        delete hashes[key];
        deletions++;
      }
    }
    fs.writeFileSync(path.join(config.outputDir, ".document-it"), JSON.stringify(hashes));
    console.log("Successfully converted all documents");
    console.log(`${conversions} files were converted`);
    console.log(`${skipped} files were skipped`);
    console.log(`${deletions} previous files were not found`);
  },
  help: async () => {
    console.log(`
  document-it

  Usage:
    document-it [command] [options]

  Commands:
    convert   Convert all source files to output files
    help      Show this help message

  Configuration:
    --filterDir=<dir>             The directory to search for filters in      (default: ./filters)
    --sourceDir=<dir>             The directory to search for source files in (default: ./documents)
    --sourceExt=<ext1,ext2,...>   The extensions of source files              (default: ["md"])
    --outputDir=<dir>             The directory to output files to            (default: ./output)
    `);
  },
};

const aliases: Record<keyof typeof commands, string[]> = {
  convert: ["convert"],
  help: ["help", "h", "--help", "-h"],
};

let command = process.argv[2] ?? "help";

// convert from alias to command
let found = false;
for (const [key, values] of Object.entries(aliases) as [keyof typeof commands, string[]][])
  if (values.includes(command)) {
    commands[key]().then(() => process.exit(0));
    found = true;
    break;
  }

if (!found) {
  console.log(`Unknown command: ${command}`);
  commands.help().then(() => process.exit(1));
}
