// @flow

import GlyphStyles from "../utils/glyphs.js";

export type LinkSourceDisplayConfig = {|
  +sourceUrlPattern: ?RegExp,
  +sourceDisplayName: ?string,
  +sourceTypeDisplayName: string,
  +iconClass: string
|};

export const LinkDisplayConfigurationByUrl: $ReadOnlyArray<LinkSourceDisplayConfig> = [
  {
    sourceUrlPattern: new RegExp("github\\.com"),
    sourceDisplayName: "GitHub",
    iconClass: GlyphStyles.Github
  },
  {
    sourceUrlPattern: new RegExp("meetup\\.com"),
    sourceDisplayName: "Meetup",
    iconClass: GlyphStyles.Meetup
  },
  {
    sourceUrlPattern: new RegExp("slack\\.com"),
    sourceDisplayName: "Slack",
    iconClass: GlyphStyles.Slack
  },
  {
    sourceUrlPattern: new RegExp("trello\\.com"),
    sourceDisplayName: "Trello",
    iconClass: GlyphStyles.Trello
  },
  {
    sourceUrlPattern: new RegExp("drive\\.google\\.com"),
    sourceDisplayName: "Google Drive",
    iconClass: GlyphStyles.GoogleDrive
  },
];

export const LinkTypes: { [key: string]: string} = {
  CODE_REPOSITORY: "link_coderepo",
  FILE_REPOSITORY: "link_filerepo",
  MESSAGING: "link_messaging",
  PROJECT_MANAGEMENT: "link_projmanage",
  LINKED_IN: "link_linkedin"
};

//TODO: Use constant link names here
export const DefaultLinkDisplayConfigurations: { [key: string]: LinkSourceDisplayConfig }  = {
  'link_messaging': {
    sourceTypeDisplayName: "Messaging",
    iconClass:  GlyphStyles.Messaging
  },
  'link_filerepo': {
    sourceTypeDisplayName: "File Repository",
    iconClass:  GlyphStyles.Folder
  },
  'link_projmanage': {
    sourceTypeDisplayName: "Project Management",
    iconClass:  GlyphStyles.Tasks
  },
  'link_linkedin': {
    sourceTypeDisplayName: "LinkedIn",
    iconClass:  GlyphStyles.LinkedIn
  },
  'link_coderepo': {
    sourceTypeDisplayName: "Code Repository",
    iconClass:  GlyphStyles.GeneralCode
  },
  other: {
    sourceTypeDisplayName: "Website",
    iconClass:  GlyphStyles.Globe
  }
};