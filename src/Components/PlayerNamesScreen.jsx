import React, { Component } from 'react';
import BackToSelectionButton from './BackToSelectionButton.jsx';
import Roles from "./Roles";

class PlayerNamesScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            playersNames: this.getPlayersNames(),
            playersRoles: this.getPlayersRoles()
        };
    }

    getPlayersNames() {
        let playerNames = [];

        for (let i = 0; i < this.props.selectedNumberOfPlayers; i++) {
            playerNames[i] =
                <div key={"label-input-container-" + i}>
                    <label key={"label-" + i}>Nome giocatore {i + 1}</label>
                    <input type="text"
                           key={i}
                           id={"name-" + i}
                           className="left-margin field"
                           onBlur={this.props.handlePlayerNameChange}
                           defaultValue={this.props.playersNames !== [] ? this.props.playerNames[i] : ""}
                    />
                </div>
        }

        return playerNames;
    }

    getPlayersRoles(){
        const supportedRoles = new Roles().getAllRoles();

        let playerRoles = [];

        for(let i = 0; i < this.props.selectedNumberOfPlayers; i++) {
            let defaultValue = this.props.playerRoles !== undefined ? this.props.playerRoles[i] : supportedRoles[0];

            playerRoles[i] =
                <div key={`select-container-${i}`}>
                    <select key={`${defaultValue}`}
                            id={`role-${i}`}
                            className="field text-select-width"
                            onChange={this.props.handlePlayerRoleSelection}
                            defaultValue={defaultValue}
                    >
                        {supportedRoles.map(role => <option key={`role-${role}-${i}`} value={role}>{role}</option>)}
                    </select>
                </div>;
        }

        return playerRoles;
    }

    render() {
        return(
            <div className="col-xs-12">
                <div className="col-xs-4" id="playersNamesDiv">
                    {this.state.playersNames}
                </div>
                <div className="col-xs-3 wide-right-margin">
                    {/*
                        For some reason, displaying this.state.playersRoles
                        doesn't update the labels if the setRandomRoles button is pressed
                    */}
                    {this.getPlayersRoles()}
                </div>
                <div className="col-xs-4 col-xs-offset-2">
                    <button className="col-xs-5 btn btn-primary top-margin right-margin confirm-players-button"
                            onClick={this.props.handlePlayerDataConfirm}>
                        Conferma
                    </button>
                </div>
                <div className="col-xs-4">
                    <BackToSelectionButton className="col-xs-5 btn btn-warning top-margin go-back-players-button"
                                           goBack={this.props.goBack}/>
                    <button className="col-xs-5 btn btn-info top-margin go-back-players-button"
                            onClick={this.props.setRandomRoles}>
                        Random roles
                    </button>
                </div>
            </div>
        );
    }
}

export default PlayerNamesScreen;
