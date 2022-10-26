import path from "node:path";
import fs from "node:fs";
import YAML from "yaml";

export interface DocumentFrontMatter {
  /**
   * The extension of your output documents.
   *
   * @default ["pdf", "docx"]
   */
  outputExt: string[];
  /**
   * The filters to use.
   */
  filters?: string[];
  /**
   * Sets the Table Of Contents (toc) depth.
   * Also implies generating a toc.
   *
   * Setting to `0` will disable the toc.
   * @default 2
   */
  tocDepth?: number;
  /**
   * Produces a standalone document.
   *
   * @default true
   */
  standalone?: boolean;
  /**
   * The title of the document.
   */
  title?: string;
  /**
   * The subtitle of the document.
   */
  subtitle?: string;
  /**
   * The author of the document.
   */
  author?: string;
}

class FrontMatter {
  private readonly dir = path.join(__dirname, "../frontMatter.tmp.yaml");

  private _data!: DocumentFrontMatter;
  public get data(): DocumentFrontMatter {
    return this._data;
  }
  private set data(data: DocumentFrontMatter) {
    this._data = data;
  }

  public set(data: DocumentFrontMatter) {
    fs.writeFileSync(this.dir, YAML.stringify(data));
    this.data = data;
  }
  public get(): DocumentFrontMatter {
    if (this.data) return this.data;
    return YAML.parse(fs.readFileSync(this.dir, "utf-8"));
  }
}

export const frontMatter = new FrontMatter();
