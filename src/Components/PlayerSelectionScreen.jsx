import React, { Component } from 'react';

class PlayerSelectionScreen extends Component {
    buildOptions(players) {
        if (players < 6)
            return null;

        let options = [];
        options.push(<option key={-1} value={-1}>--</option>);
        for (let i = 6; i <= players; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            )
        }

        return options;
    }

    render() {
        return (
            <div className="col-xs-12">
                <div className="big-text col-xs-3 col-xs-offset-4">
                    Quanti sono i giocatori?
                    <select
                        id="numberOfPlayers"
                        className="left-margin numeric-select-width"
                        onChange={this.props.handleNumberOfPlayersSelection}
                        defaultValue={this.props.selectedNumberOfPlayers > 0 ? this.props.selectedNumberOfPlayers : -1}>
                        {this.buildOptions(this.props.maxPlayers)}
                    </select>
                </div>
                <button className="btn btn-primary col-xs-1" onClick={this.props.handleNumberOfPlayersConfirm}>Conferma</button>
            </div>
        )
    }
}

export default PlayerSelectionScreen;
