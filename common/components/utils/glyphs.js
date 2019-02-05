// @flow

const GlyphStyles: {[key: string]: string} = {
  Delete: "far fa-trash-alt",
  Edit: "far fa-edit",
  Add: "fa fa-plus",
  Alert: "fa fa-bell",
  MapMarker: "fas fa-map-marker-alt fa-fw",
  Globe:"fas fa-globe-americas fa-fw",
  Clock: "fas fa-clock fa-fw",
  Search: "fa fa-search",
  Github: "fab fa-github",
  GeneralCode: "fas fa-code",
  Trello: "fab fa-trello",
  LinkedIn: "fab fa-linkedin",
  Messaging: "far fa-comment-alt",
  Folder: "far fa-folder",
  Tasks: "fas fa-tasks"
};

export const GlyphSizes: {[key: string]: string} = {
  XS: "fa-xs",
  SM: "fa-sm",
  LG: "fa-lg",
  X2: "fa-2x",
  X3: "fa-3x",
  X5: "fa-5x",
  X7: "fa-7x",
  X10: "fa-10x"
};

export function Glyph(style: string, size: ?string): string {
  return style + (size ? " " + size : "");
}

export default GlyphStyles;