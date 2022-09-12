// @flow

export const GlyphStyles: {[key: string]: string } = {
  Close: "fas fa-times", // https://fontawesome.com/icons/times?style=solid
  Delete: "far fa-trash-alt", // https://fontawesome.com/icons/trash-alt?style=regular
  Edit: "far fa-edit", // https://fontawesome.com/icons/edit?style=regular
  Figma: "fab fa-figma", //https://fontawesome.com/icons/figma?s=brands
  Add: "fas fa-plus", // https://fontawesome.com/icons/plus?style=solid
  MapMarker: "fas fa-map-marker-alt", //https://fontawesome.com/icons/map-marker-alt?style=solid
  Globe: "fas fa-globe-americas", // https://fontawesome.com/icons/globe-americas?style=solid
  University: "fas fa-university", // https://fontawesome.com/icons/university?style=solid
  Clock: "fas fa-clock", // https://fontawesome.com/icons/clock?style=solid
  Search: "fas fa-search", // https://fontawesome.com/icons/search?style=solid
  Github: "fab fa-github", // https://fontawesome.com/icons/github?style=brands
  GeneralCode: "fas fa-code", // https://fontawesome.com/icons/code?style=solid
  Trello: "fab fa-trello", // https://fontawesome.com/icons/trello?style=brands
  LinkedIn: "fab fa-linkedin", // https://fontawesome.com/icons/linkedin?style=brands
  Slack: "fab fa-slack", // https://fontawesome.com/icons/slack?style=brands
  FacebookSquare: "fab fa-facebook-square", // https://fontawesome.com/icons/facebook-square?style=brands
  TwitterSquare: "fab fa-twitter-square", // https://fontawesome.com/icons/twitter-square?style=brands
  Medium: "fab fa-medium", // https://fontawesome.com/icons/medium?style=brands
  Messaging: "far fa-comment-alt", // https://fontawesome.com/icons/comment-alt?style=regular
  GoogleDrive: "fab fa-google-drive", // https://fontawesome.com/icons/google-drive?style=brands
  YouTube: "fab fa-youtube", // https://fontawesome.com/icons/youtube?style=brands&s=brands
  Video: "fas fa-video", // https://fontawesome.com/icons/video?s=solid
  Folder: "far fa-folder", // https://fontawesome.com/icons/folder?style=regular
  Tasks: "fas fa-tasks", // https://fontawesome.com/icons/tasks?style=solid
  Meetup: "fab fa-meetup", // https://fontawesome.com/icons/meetup?style=brands
  ChartBar: "fas fa-chart-bar", // https://fontawesome.com/icons/chart-bar?style=solid
  Check: "fas fa-check", // https://fontawesome.com/icons/check?style=solid
  CircleCheck: "fas fa-check-circle", // https://fontawesome.com/icons/check-circle?style=solid
  ChevronUp: "fas fa-chevron-up", // https://fontawesome.com/icons/chevron-up?style=solid
  ChevronDown: "fas fa-chevron-down", // https://fontawesome.com/icons/chevron-down?style=solid
  ChevronLeft: "fas fa-chevron-left", // https://fontawesome.com/icons/chevron-left?style=solid
  ChevronRight: "fas fa-chevron-right", // https://fontawesome.com/icons/chevron-right?style=solid
  EllipsisV: "fas fa-ellipsis-v", // https://fontawesome.com/icons/ellipsis-v?style=solid
  Pushpin: "fas fa-thumbtack", // https://fontawesome.com/icons/thumbtack?style=solid
  Eye: "fas fa-eye", // https://fontawesome.com/icons/eye?style=solid
  EyeSlash: "fas fa-eye-slash", // https://fontawesome.com/icons/eye-slash?style=solid
  LoadingSpinner: "fas fa-spinner fa-spin", // https://fontawesome.com/icons/spinner?style=solid
  Envelope: "far fa-envelope", // https://fontawesome.com/icons/envelope?style=regular
  EnvelopeSolid: "fas fa-envelope", // https://fontawesome.com/icons/envelope?style=solid
  CreativeCommons: "fab fa-creative-commons", //https://fontawesome.com/icons/creative-commons?style=brands
  CreativeCommonsBy: "fab fa-creative-commons-by", // https://fontawesome.com/icons/creative-commons-by?style=brands
  Calendar: "far fa-calendar", // https://fontawesome.com/icons/calendar?style=regular
  CalendarSolid: "fas fa-calendar", // https://fontawesome.com/icons/calendar?style=solid
  Users: "fas fa-users", // https://fontawesome.com/icons/users?style=solid
  PDF: "far fa-file-pdf", // https://fontawesome.com/icons/file-pdf?style=regular
  Grip: "fas fa-grip-vertical", // https://fontawesome.com/icons/grip-vertical?style=solid
  Palette: "fas fa-palette", // https://fontawesome.com/v5.15/icons/palette?style=solid
  HeartEmpty: "far fa-heart", // https://fontawesome.com/v6.0/icons/heart?s=regular
  HeartFilled: "fas fa-heart", // https://fontawesome.com/v6.0/icons/heart?s=solid
  ArrowRight: "fas fa-arrow-right", // https://fontawesome.com/v6.0/icons/arrow-right?s=solid
  LaptopCode: "fas fa-laptop-code", // https://fontawesome.com/v5.15/icons/laptop-code?style=solid
  CircleArrowUp: "fa-solid fa-circle-arrow-up", // https://fontawesome.com/icons/circle-arrow-up?s=solid&f=classic
  Handshake: "fa-solid fa-handshake", // https://fontawesome.com/icons/handshake?s=solid&f=classic
  ReachingUp: "fa-sharp fa-solid fa-child-reaching", // https://fontawesome.com/icons/child-reaching?s=solid&f=sharp
  CodeBranch: "fa-solid fa-code-branch", // https://fontawesome.com/icons/code-branch?s=solid&f=classic (note homepage rotates this 90deg ccw)
  Cubes: "fa-solid fa-cubes", // https://fontawesome.com/icons/cubes?s=solid&f=classic
  HandsHolding: "fa-solid fa-hands-holding", // https://fontawesome.com/icons/hands-holding?s=solid&f=classic
  HandHoldingHeart: "fa-solid fa-hand-holding-heart", // https://fontawesome.com/icons/hand-holding-heart?s=solid&f=classic
};

export const GlyphSizes: { [key: string]: string } = {
  XS: " fa-xs",
  SM: " fa-sm",
  LG: " fa-lg",
  X2: " fa-2x",
  X3: " fa-3x",
  X5: " fa-5x",
  X7: " fa-7x",
  X10: " fa-10x",
};

export const GlyphWidth: { [key: string]: string } = {
  Fixed: " fa-fw",
};

export function Glyph(style: string, ...args): string {
  return (style += args.join(""));
}

export default GlyphStyles;
