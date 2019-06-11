// @flow

import GlyphStyles from "../utils/glyphs.js";
import _ from 'lodash';

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

export const DefaultLinkDisplayConfigurations: { [key: string]: LinkSourceDisplayConfig }  = _.fromPairs([
  [LinkTypes.MESSAGING,{
    sourceTypeDisplayName: "Messaging",
    iconClass:  GlyphStyles.Messaging
  }],
  [LinkTypes.FILE_REPOSITORY,{
    sourceTypeDisplayName: "File Repository",
    iconClass:  GlyphStyles.Folder
  }],
  [LinkTypes.PROJECT_MANAGEMENT,{
    sourceTypeDisplayName: "Project Management",
    iconClass:  GlyphStyles.Tasks
  }],
  [LinkTypes.LINKED_IN,{
    sourceTypeDisplayName: "LinkedIn",
    iconClass:  GlyphStyles.LinkedIn
  }],
  [LinkTypes.CODE_REPOSITORY,{
    sourceTypeDisplayName: "Code Repository",
    iconClass:  GlyphStyles.GeneralCode
  }],
  ["other",{
    sourceTypeDisplayName: "Website",
    iconClass:  GlyphStyles.Globe
  }]
]);