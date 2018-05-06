import React, { Component } from 'react';

class BackToSelectionButton extends Component {
    render() {
        return(
            <button className={this.props.className} onClick={this.props.goBackToSelection}>Torna indietro</button>
        );
    }
}

export default BackToSelectionButton;