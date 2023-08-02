// @flow

import React from "react";
import cdn, { Images } from "../../utils/cdn.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

export const OtherAmountSelected: string = "OTHER";

type Props = {|
  donateAmount: ?string,
  donateMonthly: ?boolean,
|};

class PaypalDonationButton extends React.Component<Props> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="PaypalDonationButton">
        <form action={window.PAYPAL_ENDPOINT} method="post" target="_top">
          {this._renderFormHiddenFields()}

          <input
            type="image"
            src={cdn.image(Images.PAYPAL_BUTTON)}
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </div>
    );
  }

  _renderFormHiddenFields(): $ReadOnlyArray<React$Node> {
    let fields: Array<React$Node> = [
      <input type="hidden" name="cancel_return" value="" />,
      <input
        type="hidden"
        name="return"
        value={url.hostname() + url.section(Section.ThankYou)}
      />,
      <input type="hidden" name="no_note" value="1" />,
      <input type="hidden" name="no_shipping" value="2" />,
      <input type="hidden" name="currency_code" value="USD" />,
      <input type="hidden" name="business" value={window.PAYPAL_PAYEE} />,
    ];

    if (
      this.props.donateAmount !== OtherAmountSelected &&
      this.props.donateMonthly
    ) {
      fields = fields.concat([
        <input type="hidden" name="cmd" value="_xclick-subscriptions" />,
        <input type="hidden" name="a3" value={this.props.donateAmount} />,
        <input type="hidden" name="p3" value="1" />,
        <input type="hidden" name="t3" value="M" />,
        <input type="hidden" name="srt" value="0" />,
        <input type="hidden" name="src" value="1" />,
      ]);
    } else {
      fields = fields.concat([
        <input type="hidden" name="cmd" value="_donations" />,
      ]);
      if (this.props.donateAmount !== OtherAmountSelected) {
        fields = fields.concat([
          <input type="hidden" name="amount" value={this.props.donateAmount} />,
        ]);
      }
    }

    return fields;
  }
}

export default PaypalDonationButton;
