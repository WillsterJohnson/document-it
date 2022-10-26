# Document It

A Node.js pandoc-wrapping library for declarative document generation.

**This project is an example of "[bodging](https://www.youtube.com/watch?v=lIFE7h3m40U)".
It *will* contain bugs, and it *will* fail inexplicably at times.**

## Installation

```bash
npm install document-it
```

## Usage

At the root of your project, make a directory called `filters` and add some JS
or CJS files like the following:

```js
// your filter MUST be a class extending this one
const { Filter } = require("document-it");

class MyFilter extends Filter {
  activation = "always"; // either `"always"` to run for every document, or
  //                        `{ yamlFilter: "filter-name" }` to run only if a
  //                        document's metadata contains a key `filter` with
  //                        an array entry of `"filter-name"`

  // whatever you return from here will be inserted into the document, replacing
  // the given element
  async filter(element) {
    this.format; // populated with the format of the current document

    this.meta; // populated with the metadata of the current document (AST format)

    this.frontmatter; // populated with the document-it frontmatter of the current document (JSON format)

    // creates an element with the given type, attributes, and content
    return this.createElement(
      "Header", // element type
      1, // header level
      ["id", ["class-1", "class-2"], [["attr-name", "attr-value"]]], // attributes
      [this.createElement("Str", "Hello World")], // content
    );
  }
};

// your filter class MUST be the default export
module.exports = MyFilter;
```

Once you have these set up, create a `documents` folder in your project's root
and add some `.md` files.

```md
---
title: foo
subtitle: bar
tocdepth: 3
outputExt:
  - pdf
  - docx
filters:
  - my-custom-filter
---

## Foo bar

Lorem ipsum dolor sit.
```

Then, run the following:

```bash
npx document-it
```

This will generate an `output` folder in your project root with a `.pdf` and
`.docx` version of your markdown files.

## Configuration

### Configuring Document It

You can use any of the given names for a config file. The config file must
contain valid JSON, and not include comments.

The names, in order of precedence, are:

- `.documentitrc`
- `.documentitrc.json`
- `.docitrc`
- `.docit.json`

The config file can contain any, all, or none of the following information:

```ts
interface Config {
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
```

Configuration can also be done via the command line:

```sh
document-it --filterDir=filters --sourceDir=documents --sourceExt=md --outputDir=output
```

### Configuring Documents

Documents can provide options to document-it via their frontmatter. The
frontmatter must be valid YAML.

The options that document-it recognizes are below, other options may be passed,
for example pandoc metadata.

```ts
interface DocumentFrontMatter {
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
}
```

An example frontmatter using all the defaults would look like:

```yaml
outputExt:
  - pdf
  - docx
# no optional filters are enabled by default
# filters:
#   - my-custom-filter
tocDepth: 2
standalone: true
```

## Examples

For an example project using this library, see the
[examples folder](https://github.com/willster277/document-it/blob/main/examples/README.md).
