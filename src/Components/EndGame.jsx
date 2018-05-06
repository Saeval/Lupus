import React, { Component } from 'react';

class EndGame extends Component {
    render() {
        return (
            <div className="jumbotron text-center title top-margin">{this.props.message}</div>
        )
    }
}

export default EndGame;
