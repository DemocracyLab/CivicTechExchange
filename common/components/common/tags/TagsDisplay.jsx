// @flow

import React from 'react'
import type {TagDefinition} from '../../../components/utils/ProjectAPIUtils.js';

type Props = {|
  tags: $ReadOnlyArray<TagDefinition>,
|};

/**
 * Displays tags
 */
class TagsDisplay extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }
  
  render(): React$Node {
    return (
      <div>
        {this.props.tags.map(
          tag => <span className="Tag-Item" key={tag.tag_name} title={tag.subcategory}>{tag.display_name}</span>
        )}
      </div>
    );
  }
}

export default TagsDisplay;