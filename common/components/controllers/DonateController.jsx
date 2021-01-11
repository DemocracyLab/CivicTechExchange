// @flow

import React from 'react';
import cdn,{Images} from "../utils/cdn.js";
import RadioButtons from "../common/selection/RadioButtons.jsx";
import PaypalDonationButton, {OtherAmountSelected} from "../common/integrations/PaypalDonationButton.jsx";
import {SelectOption} from "../types/SelectOption.jsx";
import DonateBlurb from "../componentsBySection/Donate/DonateBlurb.jsx";

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
  {label: "Other", value: OtherAmountSelected}
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
<<<<<<< HEAD

  componentDidMount() {
    prerender.ready();
  }
=======
>>>>>>> master

  handleFieldSelection(field: string, option: SelectOption): void {
    let state: State = this.state;
    state[field] = option.value;
    this.setState(state);
  }

  render(): React$Node {
    return (
<<<<<<< HEAD
      <div className="DonateController-root container pl-0 pr-0">
        <Headers
          title="democracyLab | Donate"
          description="We too are a nonprofit, and your tax-deductible gift helps us connect good people with good causes."
        />
        <div className="row ml-0 mr-0">
          <div className="col-xs-12 col-md-6 DonateController-image">
            <img src={cdn.image(Images.DONATE_SPLASH)}></img>
=======
      <div className="DonateController-root">
        <div className="panel donate-image">
          <img src={cdn.image(Images.DONATE_SPLASH)}></img>
        </div>
        <div className="panel">

          <div className="DonateController-text">
            <h1>
              Donate and make a difference
            </h1>
            <p>
              DemocracyLab is building online infrastructure to support the technology-for-good movement. Your donation will help us support the many projects and volunteers who use our platform to make our world a better place. DemocracyLab is a 501(c)(3) nonprofit organization, and your donation may be tax-deductible.
            </p>
            <DonateBlurb/>
>>>>>>> master
          </div>
          <div className="col-xs-12 col-md-6 DonateController-form-container">
            <div className="DonateController-text">
              <h1>Donate and make a difference</h1>
              <p>DemocracyLab is building online infrastructure to support the technology-for-good movement. Your donation will help us support the many projects and volunteers who use our platform to make our world a better place. DemocracyLab is a 501(c)(3) nonprofit organization, and your donation may be tax-deductible.</p>
            </div>
            <div className="DonateController-options">
              <div className="DonateController-amounts">
              <h3 className="DonateController-subheader">Amount</h3>
                <RadioButtons
                  variant="outline-dark"
                  options={DonationAmountOptions}
                  onSelection={this.handleFieldSelection.bind(this, "donateAmount")}
                />
              </div>
            </div>

              {this.state.donateAmount !== OtherAmountSelected
                ? < div className="DonateController-monthly">
                <h3 className="DonateController-subheader">Frequency</h3>
                <RadioButtons
                  variant="outline-dark"
                  options={DonationMonthlyOptions}
                  defaultSelection={DonationMonthlyOptions[0]}
                  onSelection={this.handleFieldSelection.bind(this, "donateMonthly")}
                />
                </div>
                : null
              }
              <PaypalDonationButton
              donateAmount={this.state.donateAmount}
              donateMonthly={this.state.donateMonthly}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default DonateController;
