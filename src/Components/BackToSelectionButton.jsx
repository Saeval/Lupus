import React, { Component } from 'react';

class BackToSelectionButton extends Component {
    render() {
        return(
            <button className={this.props.className} onClick={this.props.goBack}>Go back</button>
        );
    }
}

export default BackToSelectionButton;