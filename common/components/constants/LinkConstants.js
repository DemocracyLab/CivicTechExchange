// @flow

import GlyphStyles from "../utils/glyphs.js";
import type { Dictionary, KeyValuePair } from "../types/Generics.jsx";
import _ from "lodash";

export type LinkSourceDisplayConfig = {|
  +sourceUrlPattern: ?RegExp,
  +sourceDisplayName: ?string,
  +sourceTypeDisplayName: string,
  +iconClass: string,
|};

export const LinkDisplayConfigurationByUrl: $ReadOnlyArray<LinkSourceDisplayConfig> = [
  {
    sourceUrlPattern: new RegExp("github.com", "i"),
    sourceDisplayName: "GitHub",
    iconClass: GlyphStyles.Github,
  },
  {
    sourceUrlPattern: new RegExp("meetup.com", "i"),
    sourceDisplayName: "Meetup",
    iconClass: GlyphStyles.Meetup,
  },
  {
    sourceUrlPattern: new RegExp("slack.com", "i"),
    sourceDisplayName: "Slack",
    iconClass: GlyphStyles.Slack,
  },
  {
    sourceUrlPattern: new RegExp("trello.com", "i"),
    sourceDisplayName: "Trello",
    iconClass: GlyphStyles.Trello,
  },
  {
    sourceUrlPattern: new RegExp("drive.google.com", "i"),
    sourceDisplayName: "Google Drive",
    iconClass: GlyphStyles.GoogleDrive,
  },
  {
    sourceUrlPattern: new RegExp("facebook.com", "i"),
    sourceDisplayName: "Facebook",
    iconClass: GlyphStyles.FacebookSquare,
  },
  {
    sourceUrlPattern: new RegExp("twitter.com", "i"),
    sourceDisplayName: "Twitter",
    iconClass: GlyphStyles.TwitterSquare,
  },
  {
    sourceUrlPattern: new RegExp("linkedin.com", "i"),
    sourceDisplayName: "LinkedIn",
    iconClass: GlyphStyles.LinkedIn,
  },
];

export const LinkTypes: Dictionary<string> = {
  CODE_REPOSITORY: "link_coderepo",
  FILE_REPOSITORY: "link_filerepo",
  MESSAGING: "link_messaging",
  PROJECT_MANAGEMENT: "link_projmanage",
  LINKED_IN: "link_linkedin",
  DESIGN: "link_design",
  TWITTER: "social_twitter",
  FACEBOOK: "social_facebook",
};

export const DefaultLinkDisplayConfigurations: KeyValuePair<LinkSourceDisplayConfig> = _.fromPairs(
  [
    [
      LinkTypes.MESSAGING,
      {
        sourceTypeDisplayName: "Messaging",
        iconClass: GlyphStyles.Messaging,
      },
    ],
    [
      LinkTypes.FILE_REPOSITORY,
      {
        sourceTypeDisplayName: "File Repository",
        iconClass: GlyphStyles.Folder,
      },
    ],
    [
      LinkTypes.PROJECT_MANAGEMENT,
      {
        sourceTypeDisplayName: "Project Management",
        iconClass: GlyphStyles.Tasks,
      },
    ],
    [
      LinkTypes.LINKED_IN,
      {
        sourceTypeDisplayName: "LinkedIn",
        iconClass: GlyphStyles.LinkedIn,
      },
    ],
    [
      LinkTypes.CODE_REPOSITORY,
      {
        sourceTypeDisplayName: "Code Repository",
        iconClass: GlyphStyles.GeneralCode,
      },
    ],
    [
      LinkTypes.DESIGN,
      {
        sourceTypeDisplayName: "Design",
        iconClass: GlyphStyles.Palette,
      },
    ],
    [
      LinkTypes.TWITTER,
      {
        sourceTypeDisplayName: "Twitter",
        iconClass: GlyphStyles.TwitterSquare,
      },
    ],
    [
      LinkTypes.FACEBOOK,
      {
        sourceTypeDisplayName: "Facebook",
        iconClass: GlyphStyles.FacebookSquare,
      },
    ],
    [
      "other",
      {
        sourceTypeDisplayName: "Website",
        iconClass: GlyphStyles.Globe,
      },
    ],
  ]
);
