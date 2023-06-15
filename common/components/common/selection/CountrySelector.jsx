// @flow

import React from "react";
import Selector from "./Selector.jsx";
import {
  CountryList,
  CountryData,
  CountryCodeFormat,
  CountryCodeFormats,
} from "../../constants/Countries.js";
import _ from "lodash";

type Props = {|
  id: ?string,
  countryCode: ?string,
  countryCodeFormat: CountryCodeFormat,
  countryOptions: ?$ReadOnlyArray<CountryData>,
  onSelection: CountryData => void,
|};

type State = {|
  countryOptions: ?$ReadOnlyArray<CountryData>,
  selectedCountry: CountryData,
  countryCodeFormat: CountryCodeFormat,
|};

export class CountrySelector extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();
    const countryCodeFormat: string =
      props.countryCodeFormat || CountryCodeFormats.ISO_2;
    const countryList: ?$ReadOnlyArray<CountryData> =
      props.countryOptions || CountryList;
    this.state = {
      countryOptions: countryList,
      selectedCountry: this.getSelectedCountry(
        props.countryCode,
        countryCodeFormat,
        countryList
      ),
      countryCodeFormat: countryCodeFormat,
    };
  }

  getDerivedStateFromProps(nextProps: Props){
    let state: State = {
      selectedCountry: nextCountry,
      countryOptions: countryList,
    };
    
    if (!_.isEqual(nextProps, this.props)) {
      const countryCodeFormat: string =
        nextProps.countryCodeFormat || this.state.countryCodeFormat;
      const countryList: ?$ReadOnlyArray<CountryData> =
        nextProps.countryOptions || CountryList;
      const nextCountry: CountryData = this.getSelectedCountry(
        nextProps.countryCode,
        countryCodeFormat,
        countryList
      );
      return state;
    }
    return null;
  }

  getSelectedCountry(
    selectedCountryCode: string,
    countryCodeFormat: string,
    countryList: $ReadOnlyArray<CountryData>
  ): CountryData {
    return countryList.find(
      (country: CountryData) =>
        country[countryCodeFormat] === selectedCountryCode
    );
  }

  handleSelection(selection: CountryData) {
    this.setState({ selectedCountry: selection }, () =>
      this.props.onSelection(selection)
    );
  }

  render(): React$Node {
    return (
      <Selector
        id={this.props.id || "country"}
        isSearchable={true}
        isClearable={false}
        isMultiSelect={false}
        options={this.state.countryOptions}
        labelGenerator={(country: CountryData) => country.displayName}
        valueStringGenerator={(country: CountryData) =>
          country[this.state.countryCodeFormat]
        }
        selected={this.state.selectedCountry}
        onSelection={this.handleSelection.bind(this)}
      />
    );
  }
}
