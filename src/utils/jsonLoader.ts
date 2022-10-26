import fs from "node:fs";
import path from "node:path";

export function JSONLoader<T extends Record<any, any>>(filename: string): T | void {
  const configPath = path.join(process.cwd(), filename);
  if (fs.existsSync(configPath)) {
    try {
      const configRaw = fs.readFileSync(configPath, "utf-8");
      try {
        const config = JSON.parse(configRaw);
        return config as T;
      } catch (cause) {
        throw new Error(`Invalid JSON in ${filename}`);
      }
    } catch (cause) {
      throw new Error(`Error while parsing ${filename}: ${(cause as Error).message}`, { cause });
    }
  }
}
