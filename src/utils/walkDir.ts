import fs from "node:fs";
import path from "node:path";

export async function walkDir(
  dir: string,
  cb: (filePath: string) => void | Promise<void>,
  recursion = true,
) {
  // recursively get all files in the given directory
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      // if file is dir, recurse
      if (file.isDirectory()) {
        if (recursion) walkDir(filePath, cb);
      }
      // else, call callback
      else await cb(filePath);
    }
  }
}
