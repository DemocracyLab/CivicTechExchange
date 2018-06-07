import {TagDefinition} from "../utils/ProjectAPIUtils.js";

export type PositionInfo = {|
  id: ?number,
  roleTag: TagDefinition,
  description: ?string,
  descriptionUrl: ?string
|};