// @flow

import ContextualDropdown from '../../common/ContextualDropdown.jsx';
import React from 'react';
import _ from 'lodash'

type Constants = {|
  chevronOpen: string,
  chevronClosed: string,
  width: number
|};

type Props<T> = {|
  title: string,
  options: $ReadOnlyArray<T>,
  optionCategory: (T) => string,
  optionEnabled: (T) => boolean,
  optionDisplay: (T) => string,
  onOptionSelect: (T) => void
|};

type State = {|
  chevronX: number,
  showDropdown: boolean,
  optionFlatList: ?$ReadOnlyArray<T>,
  optionCategoryTree: ?{ [key: string]: $ReadOnlyArray<T> },
  categoryShown: string
|};

class SelectorDropdown<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super();
  
    const constants: Constants = {
      chevronRight: '\u25B8',
      chevronDown: '\u25BE',
      width: 185
    };
    this.constants = constants;
    
    this.state = _.assign({
      chevronX: 0,
      showDropdown: false,
      optionFlatList: null,
      optionCategoryTree: null
    }, this.initializeOptions(props));
    
    this.isReady = this.isReady.bind(this);
  }
  
  initializeOptions(props: Props) {
    if(!_.isEmpty(props.options)) {
      if(props.optionCategory && _.some(props.options, props.optionCategory)) {
        return {optionCategoryTree:_.groupBy(props.options, props.optionCategory)};
      } else {
        return {optionFlatList: props.options};
      }
    }
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.initializeOptions(nextProps));
  }
  
  isReady():boolean {
    return this.state.optionFlatList || this.state.optionCategoryTree;
  }
  
  expandCategory(category:string):void {
    this.setState({
      categoryShown: this.state.categoryShown !== category ? category : null
    });
  }
  
  render(): React$Node {
    return (
      <span style={{cursor: 'pointer'}}>
        <span onClick={() => this.isReady() && this.setState({showDropdown: !this.state.showDropdown})}>
          {this.props.title} {' '}
          {this._renderChevron()}
        </span>
        {this.state.showDropdown ? this._renderDropdown() : null}
      </span>
    );
  }
  
  _renderDropdown(): React$Node {
    return (
      <ContextualDropdown xPos={this.state.chevronX}>
        { this.props.optionCategory ? this._renderCategories() : this._renderOptions(this.state.optionFlatList) }
      </ContextualDropdown>
    );
  }
  
  _renderOptions(options: $ReadOnlyArray<T>): $ReadOnlyArray<React$Node> {
    return options.map( (option, i) => {
      const enabled = this.props.optionEnabled(option);
      const classes = "DropDownMenuItem-root " + (enabled ? "enabled" : "disabled");
      return <div
        key={i}
        className= {classes}
        onClick={() => enabled && this.props.onOptionSelect(option)}
        >
          {this.props.optionDisplay(option)}
      </div>
    });
  }
  
  _renderCategories(): $ReadOnlyArray<React$Node> {
    // TODO: Calculate this in a more intelligent way
    const subMenuX = this.state.chevronX - 50;
    
    return _.keys(this.state.optionCategoryTree).map( (category,i) => {
      const isExpanded:boolean = category === this.state.categoryShown;
      return <div
        key={i}
        className={"DropDownCategoryItem-root" + (isExpanded ? "" : " unselected")}
        onClick={this.expandCategory.bind(this, category)}
      >
        {category} { } {isExpanded ? this.constants.chevronDown : this.constants.chevronRight}
        { isExpanded
          ? <ContextualDropdown xPos={subMenuX}>
              { this._renderOptions(this.state.optionCategoryTree[category]) }
            </ContextualDropdown>
          : null
        }
      </div>
    });
  }
  
  _renderChevron(): React$Node {
    return (
      <span
        ref={this._onChevronMount.bind(this)}>
        {this.constants.chevronDown}
      </span>
    );
  }
  
  _onChevronMount(chevronElement: ?React$ElementRef<*>): void {
    const chevronX = chevronElement
      ? chevronElement.getBoundingClientRect().left - (this.constants.width / 2)
      : 0;
    this.setState({chevronX});
  }
}

export default SelectorDropdown;
