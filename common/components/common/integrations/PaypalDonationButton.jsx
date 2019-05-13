// @flow

import React from 'react';
import cdn,{Images} from "../../utils/cdn.js";
import _ from 'lodash';

export const OtherAmountSelected: string = "OTHER";

type Props = {|
  donateAmount: ?string,
  donateMonthly: ?boolean
|};

class PaypalDonationButton extends React.Component<Props> {
  constructor(): void {
    super();
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps) {
      this.setState({
        donateAmount: nextProps.donateAmount,
        donateMonthly: nextProps.donateMonthly
      });
    }
  }
  
  render(): React$Node {
    const isReady: boolean = this.state && this.state.donateAmount && !_.isUndefined(this.state.donateMonthly);
    return (
      <div className="PaypalDonationButton">
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          {isReady && this._renderFormHiddenFields()}
        
          <input type="image" disabled={!isReady} src={cdn.image("PaypalDonateButton.png")} border="0"
                 name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/>
          <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif
https://www.paypal.com/en_US/i/scr/pixel.gif
" width="1" height="1"/>
        </form>
      </div>
    );
  }
    
  _renderFormHiddenFields(): $ReadOnlyArray<React$Node> {
    let fields:Array<React$Node> = [
      <input type="hidden" name="cancel_return" value="/index/" />,
      <input type="hidden" name="shopping_url" value="/index/?section=ThankYou" />,
      <input type="hidden" name="no_note" value="1" />,
      <input type="hidden" name="no_shipping" value="1" />,
      <input type="hidden" name="currency_code" value="USD"/>,
      <input type="hidden" name="business" value="mark@democracylab.org" />
    ];
    
    if (this.state.donateAmount !== OtherAmountSelected && this.props.donateMonthly) {
      fields = fields.concat([
        <input type="hidden" name="cmd" value="_xclick-subscriptions"/>,
        <input type="hidden" name="a3" value={this.state.donateAmount}/>,
        <input type="hidden" name="p3" value="1"/>,
        <input type="hidden" name="t3" value="M"/>,
        <input type="hidden" name="srt" value="0"/>,
        <input type="hidden" name="src" value="1"/>
      ]);
    } else {
      fields = fields.concat([
        <input type="hidden" name="cmd" value="_donations" />,
      ]);
      if(this.state.donateAmount !== OtherAmountSelected) {
        fields = fields.concat([
          <input type="hidden" name="amount" value={this.state.donateAmount} />
        ]);
      }
    }
    
    return fields;
  }
}

export default PaypalDonationButton;
