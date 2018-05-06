import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div className="jumbotron text-center title top-margin">{this.props.title}</div>
        )
    }
}

export default Header;
