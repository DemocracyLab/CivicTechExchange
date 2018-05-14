// @flow

import ContextualDropdown from '../../common/ContextualDropdown.jsx';
import React from 'react';
import _ from 'lodash'

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
  optionCategoryTree: ?{ [key: string]: $ReadOnlyArray<T> }
|};

class SelectorDropdown<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super();
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
        return {optionCategoryTree:_.mapKeys(props.options, props.optionCategory)};
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
  
  render(): React$Node {
    return (
      <span
        onClick={() => this.isReady() && this.setState({showDropdown: !this.state.showDropdown})}
        style={{cursor: 'pointer'}}>
        {this.props.title} {' '}
        {this._renderChevron()}
        {this.state.showDropdown ? this._renderDropdown() : null}
      </span>
    );
  }
  
  _renderDropdown(): React$Node {
    return (
      <ContextualDropdown xPos={this.state.chevronX}>
        { this.props.optionCategory ? this._renderCategories() : this._renderOptions() }
      </ContextualDropdown>
    );
  }
  
  _renderOptions(): $ReadOnlyArray<React$Node> {
    return this.state.optionFlatList.map( (option, i) => {
      // TODO: Style element based on whether its disabled
      const enabled = this.props.optionEnabled(option);
      return <div
        key={i}
        className="IssueAreaDropDownItem-root"
        disabled={!enabled}
        onClick={() => enabled && this.props.onOptionSelect(option)}
        >
          {this.props.optionDisplay(option)}
      </div>
    });
  }
  
  _renderCategories(): $ReadOnlyArray<React$Node> {
    return NULLUNTILWEIMPLEMENT;
  }
  
  _renderChevron(): React$Node {
    const chevron = '\u25BE';
    return (
      <span
        ref={this._onChevronMount.bind(this)}>
        {chevron}
      </span>
    );
  }
  
  _onChevronMount(chevronElement: ?React$ElementRef<*>): void {
    const dropDownWidth = 185;
    const chevronX = chevronElement
      ? chevronElement.getBoundingClientRect().left - (dropDownWidth / 2)
      : 0;
    this.setState({chevronX});
  }
}

export default SelectorDropdown;
