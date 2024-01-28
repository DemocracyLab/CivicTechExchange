// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalWrapper from "../../common/ModalWrapper.jsx";

type Props = {|
  showModal: boolean,
  onConfirm: message => Promise<any>,
  onCancel: ()=>void,
  onModalHide:()=>void,
|};
type State = {|
  isProcessing: boolean,
  step:number,
  message?:string,
|};
/**
 * Modal for getting yes/no confirmation and message for reasone why
 */
class ConfirmRemoveGroupProjectModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      isProcessing: false,
      step:0,
      message:"",
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.firstStep = this.firstStep.bind(this);
    this.onHide = this.onHide.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.showModal){
      this.onHide()
    }
  }
  confirm(confirmation: boolean): void {
    const {onCancel,onConfirm} = this.props;
    const {message,step} = this.state;
    const nextStep = (confirmation)? step+1:step-1;
    if(nextStep<0) {
      onCancel();
    }else if(nextStep>1){
      this.setState({isProcessing: true});
      onConfirm(message).then(() => {
        this.setState({ isProcessing: false});
      });
    }else{
      this.setState({step:nextStep})
    }
  }
  onHide(){
    this.setState({step:0,message:''})
    this.props.onModalHide?.();
  }
  handleTextChange(e:React.ChangeEvent<HTMLTextAreaElement>):void{
    this.setState({message:e.target.value});
  }
  firstStep():React$Node{
    return <div>
      <p>Tell the Project Lead why you want to remove this project. (Optional)</p>
      <textarea  style={{width:"100%",height:"100px"}} placeholder="I am removing this project because..."  value={this.state.message} onChange={(e)=>this.handleTextChange(e)}/>
      <p>An email will be sent to the Project Lead. To reconnect this project, visit the project page to initiate the process.</p>
    </div>
  }
  secondStep():React$Node{
    return <div>
      <p>Are you sure you want to remove this project?</p>
      <p>This action cannot be undone</p>
    </div>
  }
  render(): React$Node {
    const {step,isProcessing} = this.state;
    const {showModal} = this.props;
    return (
      <ModalWrapper
        showModal={showModal}
        headerText="Remove Project from Group"
        cancelText={(step===0)? "Cancel" : "Back"}
        cancelEnabled={!isProcessing}
        submitText={(step===0)? "Remove" : "Yes, remove project"}
        submitEnabled={!isProcessing}
        onClickCancel={this.confirm.bind(this, false)}
        onClickSubmit={this.confirm.bind(this, true)}
        onModalHide={this.onHide}
      >
        {step==0? this.firstStep(): this.secondStep()}
      </ModalWrapper>
    );
  }
}

export default ConfirmRemoveGroupProjectModal;
