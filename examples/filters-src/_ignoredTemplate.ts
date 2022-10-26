// the name of this file starts with an underscore, so document-it will ignore it.
// this also works on many files at once by prefixing the directory with an underscore.
//
// eg:
// filterDir
// - _imIgnored.ts
// - _ignoredFolder
//   - imIgnored.ts
//   - imIgnoredToo.ts
// - imNotIgnored.ts


import { Filter, type FilterInput, type FilterOutput } from "document-it";

// want to use custom frontmatter to pass data around?
// go for it, pass an object or interface to the generic type
// on the Filter class
type KnownFrontmatter = {
  this_key_is_known?: string;
}

// your filter class MUST be the default export
export default class MyFilter extends Filter<KnownFrontmatter> {
  public readonly activation = "always"; // either `"always"` to run for every document, or
  //                                        `{ yamlFilter: "filter-name" }` to run only if a
  //                                        document's metadata contains a key `filter` with
  //                                        an array entry of `"filter-name"`

  // whatever you return from here will be inserted into the document, replacing
  // the given element
  public override filter(ele: FilterInput): FilterOutput {
    this.format; // populated with the format of the current document

    this.meta; // populated with the metadata of the current document (AST format)

    this.frontmatter; // populated with the document-it frontmatter of the current document (JSON format)

    // creates an element with the given type, attributes, and content
    return this.createElement(
      "Header", // element type
      1, // header level
      ["id", ["class-1", "class-2"], [["attr-name", "attr-value"]]], // attributes
      [this.createElement("Str", "Hello World")], // content
      // renders as HTML: <h1 id="id" class="class-1 class-2" attr-name="attr-value">Hello World</h1>
    );
  }
};
