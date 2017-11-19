import React from 'react'

class CharacterCounter extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var component = this;

        this.refreshElementCharacterCount();
        var input = document.getElementById(this.props.elementid);
        // add onclick event
        input.addEventListener("input", function () {
            component.refreshElementCharacterCount();
        });
    }

    refreshElementCharacterCount() {
        var input = document.getElementById(this.props.elementid);
        this.setState({characterCount:input.value.length});
    }

    render() {
        return (
        <div className="character-count">
            {this.state ? this.state.characterCount : 0} / {this.props.maxlength}
        </div>
    );
    }
}

export default CharacterCounter;
