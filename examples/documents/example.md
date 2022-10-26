---
title: Demonstration of syntax
subtitle: A reference for all the character combinations with special meaning in Pandoc Markdown
author: John 'Nameless' Doe
tocDepth: 0
---

## Available Syntax

(using one # will conflict with the `title` in frontmatter on most parsers)

## Level 1

### Level 2

#### Level 3

##### Level 4

###### Level 5

Paragraphs

- unordered
- lists

1. ordered
2. lists

```js
const syntax = "code blocks";
```

`inline code`

> blockquotes

**bold**
_italic_
~~strikethrough~~
_**bold italic**_
~~_strikethrough italic_~~
~~**strikethrough bold**~~
~~_**strikethrough bold italic**_~~

[links](https://github.com/willster277/document-it)

![images (cannot use web URLs)](./file.jpeg)

| tables | (header) | (header) |
| :----: | :------: | :------: |
|   1    |    2     |    3     |

Horizontal rule

---

Inline math

$d = 5 \text{cm}$

Block math

$$
\begin{aligned}
A &= \pi r^2 \\
&= \pi \left(\frac{d}{2}\right)^2 \\
&= \pi \left(\frac{(5)}{2}\right)^2 \\
&= \pi (2.5)^2 \\
&= \pi \cdot 6.25 \\
&\approx 19.635
\end{aligned}
$$
