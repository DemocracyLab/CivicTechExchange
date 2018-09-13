// @flow

import React from 'react';
import Select from 'react-select'
import {Countries} from "../../constants/Countries.js";

type CountryOption = {|
  value: string,
  label: string,
|};

type Props = {|
  countryCode: string,
  onSelection: (string) => void
|};

type State = {|
  selectedCountry: CountryOption,
  countries: $ReadOnlyArray<CountryOption>
|};

export const defaultCountryCode = "US";

export class CountrySelector extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    const countries: $ReadOnlyArray<CountryOption> = Object.keys(Countries).map(
      countryCode => ({"value": countryCode, "label": Countries[countryCode]})
    );
    this.state = {
      countries: countries,
      selectedCountry: this.getSelectedCountryOption(countries, props.countryCode || defaultCountryCode)
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({selectedCountry:this.getSelectedCountryOption(this.state.countries, nextProps.countryCode || defaultCountryCode)}, function() {
      this.forceUpdate();
    });
  }
  
  handleSelection(selection: CountryOption) {
    this.props.onSelection(selection.value);
  }
  
  getSelectedCountryOption(countries: $ReadOnlyArray<CountryOption>, countryCode: string) {
    return countries.find(country => country.value === countryCode);
  }
  
  render(): React$Node {
    return (
      <Select
        id="country"
        name="country"
        options={this.state.countries}
        value={this.state.selectedCountry}
        onChange={this.handleSelection.bind(this)}
        className="form-control"
        simpleValue={false}
        clearable={false}
        multi={false}
      />
    );
  }
}