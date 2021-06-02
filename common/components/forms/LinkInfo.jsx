import type { Dictionary } from "../types/Generics.jsx";

export type LinkInfo = {|
  id: ?number,
  linkUrl: string,
  linkName: string,
  visibility: string,
|};

export const LinkVisibility: Dictionary<string> = {
  PUBLIC: "PUBLIC",
};
