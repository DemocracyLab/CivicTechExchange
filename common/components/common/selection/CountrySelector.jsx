// @flow

import React from 'react';
import Selector from "./Selector.jsx";
import {CountryList, CountryData, CountryCodeFormat, CountryCodeFormats} from "../../constants/Countries.js";


type Props = {|
  countryCode: ?string,
  countryCodeFormat: CountryCodeFormat,
  onSelection: (CountryData) => void
|};

type State = {|
  selectedCountry: CountryData,
  countryCodeFormat: CountryCodeFormat
|};


export class CountrySelector extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    const countryCodeFormat: string = props.countryCodeFormat || CountryCodeFormats.ISO_2;
    this.state = {
      selectedCountry: this.getSelectedCountry(props.countryCode, countryCodeFormat),
      countryCodeFormat: countryCodeFormat
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.countryCode) {
      const nextCountry: CountryData = this.getSelectedCountry(nextProps.countryCode, nextProps.countryCodeFormat || this.state.countryCodeFormat);
      if(nextCountry !== this.state.selectedCountry) {
        this.setState({selectedCountry: nextCountry}, function () {
          this.forceUpdate();
        });
      }
    }
  }
  
  getSelectedCountry(selectedCountryCode: string, countryCodeFormat: string): CountryData {
    return CountryList.find((country:CountryData) => country[countryCodeFormat] === selectedCountryCode);
  }

  handleSelection(selection: CountryData) {
    this.setState({selectedCountry: selection}, () => this.props.onSelection(selection));
  }
  
  render(): React$Node {
    return (
      <Selector
        id="country"
        isSearchable={true}
        isClearable={true}
        isMultiSelect={false}
        options={CountryList}
        labelGenerator={(country: CountryData) => country.displayName}
        valueStringGenerator={(country: CountryData) => country[this.state.countryCodeFormat]}
        selected={this.state.selectedCountry}
        onSelection={this.handleSelection.bind(this)}
      />
    );
  }
}
