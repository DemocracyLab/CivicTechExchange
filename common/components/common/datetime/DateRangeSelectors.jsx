// @flow

import React from 'react';
import DatePicker from "react-datepicker";


type Props = {|
  dateTimeStart: ?string,
  dateTimeEnd: ?string,
  onChangeTimeStart: (string) => null,
  onChangeTimeEnd: (string) => null,
  formLabels: ?$ReadOnlyArray<string>,
  formIds: ?$ReadOnlyArray<string>,
  enforceTimeOrder: ?boolean
|};

type State = {|
  dateTimeStart: string,
  dateTimeEnd: string,
  formLabels: $ReadOnlyArray<string>,
  formIds: $ReadOnlyArray<string>
|}
export class DateRangeSelectors extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    
    this.config = {
      timeIntervals: 15,
      timeFormat: "HH:mm",
      dateFormat: "MMMM d, yyyy h:mm aa"
    };

    this.state = {
      dateTimeStart: props.dateTimeStart || new Date(),
      dateTimeEnd: props.dateTimeEnd,
      formLabels: props.formLabels || ["Start", "End"],
      formIds: props.formIds || ["startDate", "endDate"]
    };
    
    this.onChangeDateTime = this.onChangeDateTime.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      dateTimeStart: nextProps.dateTimeStart,
      dateTimeEnd: nextProps.dateTimeEnd
    });
  }
 
  onChangeDateTime(start: string, end: string): void {
    //If user entered start time after end time, reverse the two (if option enabled)
    let _start:string, _end:string;
    if(!this.props.enforceTimeOrder || !start || !end || start < end) {
      _start = start;
      _end = end;
    } else {
      _start = end;
      _end = start;
    }
  
    this.setState({
      dateTimeStart: _start,
      dateTimeEnd: _end
    });
    
    if(_start !== this.state.dateTimeStart) {
      this.props.onChangeTimeStart(_start);
    }
  
    if(_end !== this.state.dateTimeEnd) {
      this.props.onChangeTimeEnd(_end);
    }
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <input ref={this.startDateRef} type="hidden" id={this.state.formIds[0]} name={this.state.formIds[0]} value={this.state.dateTimeStart}/>
        <div className="form-group">
          <label>{this.state.formLabels[0]}</label>
          <div>
            <DatePicker
              key={this.state.formIds[0]}
              selected={this.state.dateTimeStart}
              onChange={date => this.onChangeDateTime(date, this.state.dateTimeEnd)}
              maxDate={this.state.dateTimeEnd}
              showTimeSelect
              timeFormat={this.config.timeFormat}
              timeIntervals={this.config.timeIntervals}
              dateFormat={this.config.dateFormat}
              placeholderText="Select start time"
            />
          </div>
        </div>
        <input ref={this.endDateRef} type="hidden" id={this.state.formIds[1]} name={this.state.formIds[1]} value={this.state.dateTimeEnd}/>
        <div className="form-group">
          <label>{this.state.formLabels[1]}</label>
          <div>
            <DatePicker
              key={this.state.formIds[1]}
              selected={this.state.dateTimeEnd}
              onChange={date => this.onChangeDateTime(this.state.dateTimeStart, date)}
              minDate={this.state.dateTimeStart}
              showTimeSelect
              timeFormat={this.config.timeFormat}
              timeIntervals={this.config.timeIntervals}
              dateFormat={this.config.dateFormat}
              placeholderText="Select end time"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DateRangeSelectors;