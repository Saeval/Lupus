import React, { Component } from 'react';
import BackToSelectionButton from './BackToSelectionButton.jsx';

class ErrorScreen extends Component {

    render() {
        return (
            <div className="col-xs-12">
                <div className="big-text text-danger col-xs-3 col-xs-offset-4">{this.props.errorMessage}</div>
                <BackToSelectionButton className="btn btn-danger col-xs-1" goBackToSelection={this.props.goBackToSelection}/>
            </div>
        );
    }

}

export default ErrorScreen;