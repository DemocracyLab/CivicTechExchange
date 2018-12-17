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
  categoryShown: string,
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
      optionCategoryCoords: {},
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

  selectOption(option: T, opts:object):void {
    this.props.onOptionSelect(option, opts);
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
      <div>
        {this.props.optionCategory ? null : this._renderSelectAll(this.state.optionFlatList)}
        <ContextualCollapsible showContextualArrow={true} xPos={this.state.chevronX}>
          { this.props.optionCategory ? this._renderCategories() : this._renderOptions(this.state.optionFlatList) }
        </ContextualCollapsible>
      </div>
    );
  }

  _renderOptions(options: $ReadOnlyArray<T>): $ReadOnlyArray<React$Node> {
    const sortedOptions = _.sortBy(options, this.props.optionDisplay);

    return sortedOptions.map( (option, i) => {
      const classes = "CollapsibleMenuItem"
      // to filter just entries and not entries + categories, use a conditional if (option.num_times > 0) { return ... } here instead of initializeOptions (though removing items + empty categories is usually desired)
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
          ? <span>
            {this._renderSelectAll(this.state.optionCategoryTree[category])}
            <ContextualCollapsible>
              { this._renderOptions(this.state.optionCategoryTree[category]) }
            </ContextualCollapsible>
            </span>
          : null
        }
      </div>
    });
  }
  _renderSelectAll(category): React$Node {
    //TODO: replace this absurdly hacky method of generating a subcategory/category name
    //it works because we can rely on the _.groupBy() and filteredOptions in this.initializeOptions, idx 0 of any given cat/subcat is guaranteed to exist (no empty categories allowed) and return the right value due to grouping.
    let selectAllId = category[0].subcategory || category[0].category
    return (
      <span>
        <label className="CollapsibleMenuItem">
          <
            input type="checkbox"
            className="ContextualCollapsible-selectAll"
            checked={this._selectAllController.bind(this, category)}
            onChange={this._handleSelectAll.bind(this, category)}
            id={selectAllId}
          >
          </input>Select All
        </label>
      </span>
    )
  }

  _selectAllController(category) {
    //return true or false if number of selected items in category = total items in category
    let selectedTagCount = this.props.selectedByCategory[category].length
    console.log('category: ', category)
    console.log('category.length', category.length)
    console.log('selectAllId', selectAllId)
    console.log('selectedTagCount: ', selectedTagCount)
    if (selectedTagCount.length === category.length) {
      this.setState({
        [selectAllId]: true
      })
    } else {
      this.setState({
        [selectAllId]: false
      })
    }
  }


  _handleSelectAll(category, event): React$Node {
    //this feels like a mess, but find what tags are selected or not and then either select or unselect the remainder
    if(this.state[event.target.id]) {
      let toUpdate = category.filter(tag => this.props.optionEnabled(tag) === true)
      this.selectOption(toUpdate, {multiple: true, type: "REMOVE_MANY_TAGS"} );
    } else {
      let toUpdate = category.filter(tag => this.props.optionEnabled(tag) === false)
      this.selectOption(toUpdate, {multiple: true, type: "ADD_TAG"} );
    }
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
  // this is from when I had the state controlling checkboxes in TagSelectorCollapsible, for ref
  // componentDidUpdate(prevProps, prevState) {
  //   // only update if the data has changed
  //   let prevLength = Object.keys(prevState.selectedTags).length
  //   let curLength = Object.keys(this.state.selectedTags).length
  //   console.log("prevState length: ", prevLength)
  //   console.log("this.state length: ", curLength)
  //   if (prevLength !== curLength) {
  //     this._allCheckboxControl();
  //   }
  // }
  //
  // _allCheckboxControl(): void {
  //   // handle checking or unchecking any given Select All checkbox
  //   let selectedTagCount = Object.keys(this.state.selectedTags)
  //   let activeTagCount = this.state.tags ? this.state.tags.filter(function(key) {
  //       return key.num_times > 0;
  //     }) : 0;
  //   console.log('activeTagCount: ', activeTagCount)
  //   if(selectedTagCount.length === activeTagCount.length) {
  //     this.setState({isAllChecked: true});
  //   } else {
  //     this.setState({isAllChecked: false});
  //   }
  // }
}

export default SelectorCollapsible;
