import React, { Component } from 'react';
import BackToSelectionButton from './BackToSelectionButton.jsx';
import Roles from "./Roles";

class PlayerNamesScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            playersNames: [],
            playersRoles: []
        };

        this.fillPlayersNames();
        this.fillPlayersRoles();
    }

    fillPlayersNames(){
        for (let i = 0; i < this.props.selectedNumberOfPlayers; i++) {
            this.state.playersNames.push(
                <div key={"label-input-container-" + i}>
                    <label key={"label-" + i}>Nome giocatore {i + 1}</label>
                    <input type="text"
                           key={i}
                           id={"name-" + i}
                           className="left-margin field"
                           onInput={this.props.handlePlayerNameChange}
                           defaultValue={this.props.playersNames !== [] ? this.props.playerNames[i] : ""}
                    />
                </div>
            )
        }
    }

    fillPlayersRoles(){
        const supportedRoles = new Roles().getRoles();

        for(let i = 0; i < this.props.selectedNumberOfPlayers; i++){
            this.state.playersRoles.push(
            <div key={"select-container-" + i}>
                <select key={"select-role-" + i}
                        id={"role-" + i}
                        className="field text-select-width"
                        onChange={this.props.handlePlayerRoleSelection}
                        defaultValue={this.props.playerRoles !== undefined ? this.props.playerRoles[i] : supportedRoles[0]}
                >
                    {supportedRoles.map(role => <option key={"role-" + role + "-" + i} value={role}>{role}</option>)}
                </select>
            </div>
            )
        }
    }

    render() {
        return(
            <div className="col-xs-12">
                <div className="col-xs-4" id="playersNamesDiv">
                    {this.state.playersNames}
                </div>
                <div className="col-xs-4 wide-right-margin">
                    {this.state.playersRoles}
                </div>
                <div className="col-xs-4 col-xs-offset-2">
                    <button className="col-xs-5 btn btn-primary top-margin right-margin confirm-players-button"
                            onClick={this.props.handlePlayerDataConfirm}>
                        Conferma
                    </button>
                </div>
                <div className="col-xs-4">
                    <BackToSelectionButton className="col-xs-5 btn btn-warning top-margin go-back-players-button" goBackToSelection={this.props.goBackToSelection}/>
                </div>
            </div>
        );
    }
}

export default PlayerNamesScreen;
