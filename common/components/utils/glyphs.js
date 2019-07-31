// @flow

export const GlyphStyles: {[key: string]: string} = {
  Close: "fas fa-times",
  Delete: "far fa-trash-alt",
  Edit: "far fa-edit",
  Add: "fa fa-plus",
  Alert: "fa fa-bell",
  MapMarker: "fas fa-map-marker-alt",
  Globe:"fas fa-globe-americas",
  University:"fas fa-university",
  Clock: "fas fa-clock",
  Search: "fa fa-search",
  Github: "fab fa-github",
  GeneralCode: "fas fa-code",
  Trello: "fab fa-trello",
  LinkedIn: "fab fa-linkedin",
  Slack: "fab fa-slack",
  FacebookSquare: "fab fa-facebook-square",
  TwitterSquare: "fab fa-twitter-square",
  Medium: "fab fa-medium",
  Messaging: "far fa-comment-alt",
  GoogleDrive: "fab fa-google-drive",
  Folder: "far fa-folder",
  Tasks: "fas fa-tasks",
  Meetup: "fab fa-meetup",
  ChartBar: "fas fa-chart-bar",
  Check: "fas fa-check",
  CircleCheck: "fas fa-check-circle",
  ChevronUp: "fas fa-chevron-up",
  ChevronDown: "fas fa-chevron-down",
  EllipsisV: "fas fa-ellipsis-v",
  Pushpin: "fas fa-thumbtack",
  Eye: "fas fa-eye",
  LoadingSpinner: "fas fa-spinner fa-spin"
};

export const GlyphSizes: {[key: string]: string} = {
  XS: " fa-xs",
  SM: " fa-sm",
  LG: " fa-lg",
  X2: " fa-2x",
  X3: " fa-3x",
  X5: " fa-5x",
  X7: " fa-7x",
  X10: " fa-10x"
};

export const GlyphWidth: {[key: string]: string} = {
  Fixed: " fa-fw",
}

export function Glyph(style: string, ...args): string {
  return style += args.join('');
}

export default GlyphStyles;
