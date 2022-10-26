import { Filter, FilterInput, FilterOutput } from "document-it";
import { Constants } from "./_xmlStubs.js";

export default class MyFilter extends Filter {
  public override filter(ele: FilterInput): FilterOutput {
    if (ele.t === "RawBlock" && ele.c[1] === "\\newpage") return Constants.pageBreak;
  }
  readonly activation = "always";
}
