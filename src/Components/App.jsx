import React, { Component } from 'react';
import PlayerSelectionScreen from './PlayerSelectionScreen';
import PlayerNamesScreen from './PlayerNamesScreen';
import ErrorScreen from "./ErrorScreen";
import Header from "./Header";
import Roles from "./Roles";
import GameStates from "./GameStates";
import NightWolvesPhaseScreen from "./NightWolvesPhaseScreen"
import DayPhaseScreen from "./DayPhaseScreen"
//import './fonts/glyphicons-halflings-regular.eot';

class Game extends Component {

    setUpHandlers() {
        this.goBackToSelection = this.goBackToSelection.bind(this);
        this.handleNumberOfPlayersSelection = this.handleNumberOfPlayersSelection.bind(this);
        this.handleNumberOfPlayersConfirm = this.handleNumberOfPlayersConfirm.bind(this);
        this.handlePlayerRoleSelection = this.handlePlayerRoleSelection.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handlePlayerDataConfirm = this.handlePlayerDataConfirm.bind(this);
        this.confirmKillSelection = this.confirmKillSelection.bind(this);
        this.handleWolvesChoice = this.handleWolvesChoice.bind(this);
    }

    constructor(){
        super();

        this.state = {
            phases: new GameStates().getStates(),
            roles: new Roles(),
            currentPhaseIndex: 0,
            selectedNumberOfPlayers: -1,
            error: false,
            errorMessage: "",
            playerNames: [],
            playerRoles: [],
            victim: ""
        };

        this.setUpHandlers();
    }

    goToNextPhase(){
        let newIndex = this.state.currentPhaseIndex + 1;
        this.setState({currentPhaseIndex: newIndex});
    }

    goToPreviousPhase(){
        let newIndex = this.state.currentPhaseIndex - 1;
        this.setState({currentPhaseIndex: newIndex});
    }

    goToNightWolvesPhase(){
      this.setState({currentPhaseIndex: 2});
    }

    goToDayPhase(){
      this.setState({currentPhaseIndex: 3});
    }

    goBackToSelection(){
        this.goToPreviousPhase();
        this.setState({
            error: false,
            errorMessage: ''
        });
    }

    handleNumberOfPlayersSelection(event){
        this.setState({ selectedNumberOfPlayers: event.target.value });
        this.initializePlayerFields(event.target.value);
    }

    handleNumberOfPlayersConfirm(){
        if (this.state.selectedNumberOfPlayers > 3)
            this.goToNextPhase();
        else
            this.setErrorMessage('Selezionare un numero valido di giocatori!');
    }

    setErrorMessage(message){
        this.setState({
            error: true,
            errorMessage: message
        });
    }

    initializePlayerFields(numberOfPlayers){
        let tempNames = this.state.playerNames;
        let tempRoles = this.state.playerRoles;

        if (tempRoles.length === 0)
            for (let i = 0; i < numberOfPlayers; i++)
                tempRoles.push(this.state.roles.getDefaultRole());

        this.resetData(numberOfPlayers, tempNames, tempRoles);

        this.setState({ playerNames: tempNames });
        this.setState({ playerRoles: tempRoles });
    }

    resetData(numberOfPlayers, tempNames, tempRoles) {
        if (this.state.playerRoles.length > numberOfPlayers) {
            for (let i = numberOfPlayers; i < this.state.playerRoles.length; i++) {
                tempNames[i] = '';
                tempRoles[i] = this.state.roles.getDefaultRole();
            }
        }
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
        this.goToNightWolvesPhase();
    }

    validate(){
        this.isNumberOfWolvesAcceptable();
        this.allPlayersHaveNames();

        return true;
    }

    isNumberOfWolvesAcceptable(){
        let wolves = 0;
        const maxNumberOfWolves = Math.round(this.state.selectedNumberOfPlayers / 3);

        for(let i = 0; i < this.state.selectedNumberOfPlayers; i++) {
            if (this.state.playerRoles[i] === this.state.roles.getRoleByName('lupo'))
                wolves++;
        }

        if (wolves === 0)
            this.setErrorMessage('Ci deve essere almeno un lupo!');

        if (wolves > maxNumberOfWolves)
            this.setErrorMessage('Ci sono troppi lupi per il numero di giocatori selezionato!');
    }

    allPlayersHaveNames(){
        if (this.state.playerNames.length === 0)
            this.setErrorMessage('Tutti i giocatori devono avere un nome!');

        for(let i = 0; i < this.state.selectedNumberOfPlayers; i++) {
            if (this.state.playerNames[i] === undefined)
                this.setErrorMessage('Tutti i giocatori devono avere un nome!');
        }
    }

    confirmKillSelection(event){
      console.log(`${event.target.value} has been chosen as victim`);
      this.setState({victim: event.target.value });
    }

    handleWolvesChoice(){
      this.validateVictim();
      this.goToDayPhase();
    }

    validateVictim(){
      // TODO quando ci saranno altri ruoli
    }


    render() {
        const maxNumberOfPlayers = 9;
        const headerTitle = 'Welcome to Lupus in Fabula!';

        let returnValue;

        if (this.state.error)
            returnValue = <ErrorScreen
                            errorMessage={this.state.errorMessage}
                            goBackToSelection={this.goBackToSelection}
                          />;

        else if (this.state.phases[this.state.currentPhaseIndex] === this.state.phases[0])
            returnValue = <PlayerSelectionScreen
                            maxPlayers={maxNumberOfPlayers}
                            handleNumberOfPlayersSelection={this.handleNumberOfPlayersSelection}
                            selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                            handleNumberOfPlayersConfirm={this.handleNumberOfPlayersConfirm}
                          />;

        else if (this.state.phases[this.state.currentPhaseIndex] === this.state.phases[1])
            returnValue = <PlayerNamesScreen
                            selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                            goBackToSelection={this.goBackToSelection}
                            handlePlayerRoleSelection={this.handlePlayerRoleSelection}
                            handlePlayerNameChange={this.handlePlayerNameChange}
                            handlePlayerDataConfirm={this.handlePlayerDataConfirm}
                            playerNames={this.state.playerNames}
                            playerRoles={this.state.playerRoles}
                          />;

        else if (this.state.phases[this.state.currentPhaseIndex] === this.state.phases[2])
            returnValue = <NightWolvesPhaseScreen
                            numberOfPlayers={this.state.selectedNumberOfPlayers}
                            playerNames={this.state.playerNames}
                            playerRoles={this.state.playerRoles}
                            confirmKillSelection={this.confirmKillSelection}
                            handleWolvesChoice={this.handleWolvesChoice}
                          />
        else if (this.state.phases[this.state.currentPhaseIndex] === this.state.phases[3])
            returnValue = <DayPhaseScreen
                            victim={this.state.victim}
                            players={this.state.playerNames}
                          />



        return (
          <div className="col-xs-12">
              <Header title={headerTitle}/>
              {returnValue}
          </div>
        );
  }
}

export default Game;
