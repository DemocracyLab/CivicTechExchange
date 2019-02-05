// @flow

import GlyphStyles from "../utils/glyphs.js";

export type LinkSourceDisplayConfig = {|
  +sourceUrlPattern: ?RegExp,
  +sourceDisplayName: ?string,
  +sourceTypeDisplayName: string,
  +iconClass: string
|};

// TODO: Remove sourceTypeDisplayName
export const LinkDisplayConfigurationByUrl: $ReadOnlyArray<LinkSourceDisplayConfig> = [
  {
    sourceUrlPattern: new RegExp("github\\.com"),
    sourceDisplayName: "GitHub",
    sourceTypeDisplayName: "Code Repository",
    iconClass: GlyphStyles.Github
  },
  {
    sourceUrlPattern: new RegExp("meetup\\.com"),
    sourceDisplayName: "Meetup",
    sourceTypeDisplayName: "Organizer",
    iconClass: GlyphStyles.Meetup
  },
  {
    sourceUrlPattern: new RegExp("slack\\.com"),
    sourceDisplayName: "Slack",
    sourceTypeDisplayName: "Messaging",
    iconClass: GlyphStyles.Slack
  },
  {
    sourceUrlPattern: new RegExp("trello\\.com"),
    sourceDisplayName: "Trello",
    sourceTypeDisplayName: "Project Management",
    iconClass: GlyphStyles.Trello
  },
  {
    sourceUrlPattern: new RegExp("drive\\.google\\.com"),
    sourceDisplayName: "Google Drive",
    sourceTypeDisplayName: "File Repository",
    iconClass: GlyphStyles.GoogleDrive
  },
];

export const DefaultLinkDisplayConfigurations:  { [key: string]: LinkSourceDisplayConfig }  = {
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

// TODO: Remove and use DefaultLinkDisplayConfigurations
export const LinkNames = {
  'link_coderepo': "Code Repository",
  'link_messaging': "Messaging",
  'link_filerepo': "File Repository",
  'link_projmanage': "Project Management",
  'link_linkedin' : "LinkedIn"
};
