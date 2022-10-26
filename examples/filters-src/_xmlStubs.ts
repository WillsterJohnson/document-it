import { RawBlock } from "pandoc-filter";

export class Constants {
  public static readonly pageBreak = RawBlock(
    "openxml",
    `<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>`,
  );
}
