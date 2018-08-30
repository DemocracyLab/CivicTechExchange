// @flow

import ContextualCollapsible from '../../common/ContextualCollapsible.jsx';
import React from 'react';
import _ from 'lodash'

type Constants = {|
  chevronOpen: string,
  chevronClosed: string,
  width: number
|};


/**
 * @title: Title of the dropdown
 * @options: List of options that dropdown selector displays
 * @optionCategory: Selector for categorizing options (Turns into a 2-level selector)
 * @optionEnabled: Determines whether any given option is selectable
 * @optionDisplay: How to display option
 * @onOptionSelect: Callback for when option is selected
 */
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
  optionCategoryCoords: { [key: string]: ClientRect},
  categoryShown: string
|};

/**
 * Generic dropdown selector that supports either 1 or 2 levels
 */
class SelectorCollapsible<T> extends React.PureComponent<Props<T>, State> {
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
      optionCategoryTree: null,
      optionCategoryCoords: {}
    }, this.initializeOptions(props));

    this.isReady = this.isReady.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  initializeOptions(props: Props) {
    if(!_.isEmpty(props.options)) {
      let filteredOptions = props.options.filter(function(key) {
          return key.num_times > 0;
        })
      if(props.optionCategory && _.some(filteredOptions, props.optionCategory)) {
        return {optionCategoryTree:_.groupBy(filteredOptions, props.optionCategory)};
      } else {
        return {optionFlatList: filteredOptions};
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

  selectOption(option: T):void {
    this.props.onOptionSelect(option);
  }

  render(): React$Node {
    return (
      <span className="CollapsibleCategoryContainer">
        <span className="CollapsibleCategoryHeader" onClick={() => this.isReady() && this.setState({showDropdown: !this.state.showDropdown})}>
          {this.props.title} {' '}
          {this._renderChevron()}
        </span>
        {this.state.showDropdown ? this._renderDropdown() : null}
      </span>
    );
  }

  _renderDropdown(): React$Node {
    return (
      <ContextualCollapsible showContextualArrow={true} xPos={this.state.chevronX}>
        { this.props.optionCategory ? this._renderCategories() : this._renderOptions(this.state.optionFlatList) }
      </ContextualCollapsible>
    );
  }

  _renderOptions(options: $ReadOnlyArray<T>): $ReadOnlyArray<React$Node> {
    const sortedOptions = _.sortBy(options, this.props.optionDisplay);

    return sortedOptions.map( (option, i) => {
      const classes = "CollapsibleMenuItem"
      // to filter just entries and not category headers, use a conditional if (option.num_times > 0) { return ... }
      return <label
        key={i}
        className={classes}
        ><input type="checkbox" checked={this.props.optionEnabled(option)} onChange={() => this.selectOption(option)}></input>
        {this.props.optionDisplay(option)} ({option.num_times})
      </label>
    });
  }

  _renderCategories(): $ReadOnlyArray<React$Node> {
    return (_.keys(this.state.optionCategoryTree).sort()).map( (category,i) => {
      const isExpanded:boolean = category === this.state.categoryShown;
      const classes: string = "CollapsibleCategoryItem-root"
        + (isExpanded ? "" : " unselected")
      return <div
        key={i}
        ref={this._onCategoryMount.bind(this, category)}
        className={classes}
      >
      <span className="CollapsibleCategorySubheader" onClick={this.expandCategory.bind(this, category)}>
        {category} { } {isExpanded ? this.constants.chevronDown : this.constants.chevronRight}</span>
        { isExpanded
          ? <ContextualCollapsible>
              { this._renderOptions(this.state.optionCategoryTree[category]) }
            </ContextualCollapsible>
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

  _onCategoryMount(category: string, categoryElement: ?React$ElementRef<*>): void {
    if(categoryElement) {
      this.state.optionCategoryCoords[category] = categoryElement.getBoundingClientRect();
    }
  }

  _onChevronMount(chevronElement: ?React$ElementRef<*>): void {
    const chevronX = chevronElement
      ? chevronElement.getBoundingClientRect().left - (this.constants.width / 2)
      : 0;
    this.setState({chevronX});
  }
}

export default SelectorCollapsible;
