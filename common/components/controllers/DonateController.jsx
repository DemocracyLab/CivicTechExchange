// @flow

import React from 'react';
import cdn,{Images} from "../utils/cdn.js";
import Headers from "../common/Headers.jsx";
import RadioButtons from "../common/selection/RadioButtons.jsx";
import PaypalDonationButton from "../common/integrations/PaypalDonationButton.jsx";
import {SelectOption} from "../types/SelectOption.jsx";

type State = {|
  donateAmount: ?string,
  donateMonthly: ?string
|};

const DonationAmountOptions: $ReadOnlyArray<SelectOption> = [
  {label: "$10", value: "10"},
  {label: "$25", value: "25"},
  {label: "$50", value: "50"},
  {label: "$75", value: "75"},
  {label: "$100", value: "100"},
  {label: "$250", value: "250"},
  {label: "$500", value: "500"},
  {label: "Other", value: null}
];

const DonationMonthlyOptions: $ReadOnlyArray<SelectOption> = [
  {label: "One-Time", value: false},
  {label: "Monthly", value: true}
];

class DonateController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      donateAmount: null,
      donateMonthly: null
    };
  }
  
  handleFieldSelection(field: string, option: SelectOption): void {
    let state: State = this.state;
    state[field] = option.value;
    this.setState(state);
  }
  
  render(): React$Node {
    return (
      <div className="DonateController-root">
        <div className="panel donate-image">
          <img src={cdn.image("DonateBG.jpg")}></img>
        </div>
        <div className="panel">
          <div className="DonateController-amounts">
            <RadioButtons
              options={DonationAmountOptions}
              onSelection={this.handleFieldSelection.bind(this, "donateAmount")}
            />
          </div>
    
          <div className="DonateController-monthly">
            <RadioButtons
              options={DonationMonthlyOptions}
              defaultSelection={DonationMonthlyOptions[0]}
              onSelection={this.handleFieldSelection.bind(this, "donateMonthly")}
            />
          </div>
        
          <PaypalDonationButton
            donateAmount={this.state.donateAmount}
            donateMonthly={this.state.donateMonthly}
          />
        </div>

      </div>
    );
  }
}

export default DonateController;
