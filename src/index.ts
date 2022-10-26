import {
  type AnyElt,
  type Elt,
  type PandocMetaMap,
  Plain,
  Para,
  CodeBlock,
  RawBlock,
  BlockQuote,
  OrderedList,
  BulletList,
  DefinitionList,
  Header,
  HorizontalRule,
  Table,
  Div,
  Null,
  Str,
  Emph,
  Strong,
  Strikeout,
  Superscript,
  Subscript,
  SmallCaps,
  Quoted,
  Cite,
  Code,
  Space,
  LineBreak,
  Formula,
  RawInline,
  Link,
  Image,
  Note,
  Span,
} from "pandoc-filter";
import { DocumentFrontMatter } from "./utils/frontMatter.js";

type Promisable<T> = T | Promise<T>;
type Arrayable<T> = T | T[];

const EltMakers = {
  Plain,
  Para,
  CodeBlock,
  RawBlock,
  BlockQuote,
  OrderedList,
  BulletList,
  DefinitionList,
  Header,
  HorizontalRule,
  Table,
  Div,
  Null,
  Str,
  Emph,
  Strong,
  Strikeout,
  Superscript,
  Subscript,
  SmallCaps,
  Quoted,
  Cite,
  Code,
  Space,
  LineBreak,
  RawInline,
  Link,
  Image,
  Note,
  Span,
  Math: Formula,
};

type EltMakers = typeof EltMakers;

export type FilterInput = AnyElt;
export type FilterOutput = Arrayable<AnyElt> | void;

export abstract class Filter<KnownFrontmatter = {}> {
  public constructor() {}
  public abstract activation: "always" | { yamlFilter: string };

  /**
   * The output format pandoc is targeting.
   */
  private _format!: string;
  public get format(): string {
    return this._format;
  }

  /**
   * The metadata of the document.
   */
  private _meta!: PandocMetaMap;
  public get meta(): PandocMetaMap {
    return this._meta;
  }

  /**
   * The frontmatter of the document.
   */
  private _frontmatter!: DocumentFrontMatter & KnownFrontmatter;
  public get frontmatter(): DocumentFrontMatter & KnownFrontmatter {
    return this._frontmatter;
  }

  protected createElement<T extends keyof typeof EltMakers>(
    eltType: T,
    ...args: Parameters<typeof EltMakers[T]>
  ): Elt<T> {
    // @ts-expect-error - it's obvious that `args` is a tuple of the paramaters of the function
    return EltMakers[eltType](...args);
  }

  /**
   * Given an Element, determine what it should be replaced by (if anything).
   *
   * Return any nullish value to not replace the element.
   *
   * @param ele - The current document node.
   */
  public abstract filter(ele: FilterInput): Promisable<FilterOutput>;
}

export { type AnyElt };
