import React, { Component } from 'react';
import PlayerSelectionScreen from './PlayerSelectionScreen';
import PlayerNamesScreen from './PlayerNamesScreen';
import ErrorScreen from "./ErrorScreen";
import Header from "./Header";
import Roles from "./Roles";
//import './fonts/glyphicons-halflings-regular.eot';

class Game extends Component {

    constructor(){
        super();
        this.state = {
            confirmedSelection: false,
            selectedNumberOfPlayers: -1,
            error: false,
            errorMessage: "",
            playerNames: [],
            playerRoles: []
        };
        this.goBackToSelection = this.goBackToSelection.bind(this);
        this.handleNumberOfPlayersSelection = this.handleNumberOfPlayersSelection.bind(this);
        this.handleNumberOfPlayersConfirm = this.handleNumberOfPlayersConfirm.bind(this);
        this.handlePlayerRoleSelection = this.handlePlayerRoleSelection.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handlePlayerDataConfirm = this.handlePlayerDataConfirm.bind(this);
    }

    goBackToSelection(){
        this.setState({
            confirmedSelection: false,
            error: false,
            errorMessage: ""
        });
    }

    handleNumberOfPlayersConfirm(){
        if (this.state.selectedNumberOfPlayers > 3) {
            this.setState({
                confirmedSelection: true
            });
        } else {
            this.setErrorMessage("Selezionare un numero valido di giocatori!");
        }
    }

    setErrorMessage(message){
        this.setState({
            confirmedSelection: false,
            error: true,
            errorMessage: message
        });
    }

    handleNumberOfPlayersSelection(event){
        this.setState({ selectedNumberOfPlayers: event.target.value });
        this.initializePlayerFields(event.target.value);
    }

    initializePlayerFields(numberOfPlayers){
        const supportedRoles = new Roles().getRoles();
        let tempRoles = [];

        for(let i = 0; i < numberOfPlayers; i++)
            tempRoles.push(supportedRoles[0]);

        this.setState({ playerRoles: tempRoles });
    }

    handlePlayerRoleSelection(event){
        let newRoles = this.state.playerRoles;
        let selectedRole = event.target.value;
        let position = event.target.id.split('-')[1];

        newRoles[position] = selectedRole;

        this.setState({ playerRoles: newRoles });
    }

    handlePlayerNameChange(event){
        let newNames = this.state.playerNames;
        let position = event.target.id.split('-')[1];

        newNames[position] = event.target.value;

        this.setState({ playerNames: newNames });
    }

    handlePlayerDataConfirm(){
        this.validate();
    }

    validate(){
        /*for(let i = 0; i < this.state.selectedNumberOfPlayers; i++)
            console.log(this.state.playerNames[i] + ' è un ' + this.state.playerRoles[i]);*/

        let wolves = 0;
        const maxNumberOfWolves = Math.round(this.state.selectedNumberOfPlayers / 3);

        for(let i = 0; i < this.state.selectedNumberOfPlayers; i++) {
            if (this.state.playerRoles[i].toLowerCase() === 'lupo')
                wolves++;
        }

        if (wolves > maxNumberOfWolves)
            this.setErrorMessage('Ci sono troppi lupi per il numero di giocatori selezionato!');


        return true;
    }


    render() {
        const maxNumberOfPlayers = 6;
        const headerTitle = "Welcome to Lupus in Fabula!";

        let returnValue;

        if (this.state.error)
            returnValue = <ErrorScreen
                            errorMessage={this.state.errorMessage}
                            goBackToSelection={this.goBackToSelection}
                          />;

        else if (this.state.confirmedSelection)
            returnValue = <PlayerNamesScreen
                            selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                            goBackToSelection={this.goBackToSelection}
                            handlePlayerRoleSelection={this.handlePlayerRoleSelection}
                            handlePlayerNameChange={this.handlePlayerNameChange}
                            handlePlayerDataConfirm={this.handlePlayerDataConfirm}
                          />;

        else if (!this.state.confirmedSelection)
            returnValue = <PlayerSelectionScreen
                                maxPlayers={maxNumberOfPlayers}
                                handleNumberOfPlayersSelection={this.handleNumberOfPlayersSelection}
                                selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                                handleNumberOfPlayersConfirm={this.handleNumberOfPlayersConfirm}
                           />;

        return (
          <div className="col-xs-12">
              <Header title={headerTitle}/>
              {returnValue}
          </div>
        );
  }
}

export default Game;
