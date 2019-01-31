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
    sourceUrlPattern: new RegExp("^(www\\.)?github\\.com"),
    sourceDisplayName: "GitHub",
    sourceTypeDisplayName: "Code Repository",
    iconClass: GlyphStyles.Github
  }
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
