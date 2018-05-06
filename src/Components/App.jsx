import React, { Component } from 'react';
import PlayerSelectionScreen from './PlayerSelectionScreen';
import PlayerNamesScreen from './PlayerNamesScreen';
import ErrorScreen from "./ErrorScreen";
import Header from "./Header";
import Roles from "./Roles";
import NightWolvesPhaseScreen from "./NightWolvesPhaseScreen"
import DayPhaseScreen from "./DayPhaseScreen"
//import './fonts/glyphicons-halflings-regular.eot';

class Game extends Component {

    setUpHandlers(){
        this.resetError = this.resetError.bind(this);
        this.goToPreviousPhase = this.goToPreviousPhase.bind(this);
        this.handleNumberOfPlayersSelection = this.handleNumberOfPlayersSelection.bind(this);
        this.handleNumberOfPlayersConfirm = this.handleNumberOfPlayersConfirm.bind(this);
        this.handlePlayerRoleSelection = this.handlePlayerRoleSelection.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handlePlayerDataConfirm = this.handlePlayerDataConfirm.bind(this);
        this.confirmKillSelection = this.confirmKillSelection.bind(this);
        this.handleWolvesChoice = this.handleWolvesChoice.bind(this);
        this.handleCommonersChoice = this.handleCommonersChoice.bind(this);
    }

    constructor(){
        super();

        this.state = {
            roles: new Roles(),
            currentPhase: 0,
            selectedNumberOfPlayers: -1,
            error: false,
            errorMessage: '',
            playerNames: [],
            playerRoles: [],
            alivePlayers: [],
            wolvesKill: '',
            commonersKill: ''
        };

        this.setUpHandlers();
    }

    goToPlayerDataScreen(){
        console.log(`Setting phase to: 1`);
        this.setState({currentPhase: 1});
    }

    goToPreviousPhase(){
        let newIndex = this.state.currentPhase - 1;
        console.log(`Setting phase to: ${newIndex}`);
        this.setState({currentPhase: newIndex});
    }

    goToNightWolvesPhase(){
        console.log(`Setting phase to: 2`);
        this.setState({currentPhase: 2});
    }

    goToDayPhase(){
        console.log(`Setting phase to: 3`);
        this.setState({currentPhase: 3});
    }

    resetError(){
        console.log(`Resetting error`);
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
        //console.log(`Number of players: ${this.state.selectedNumberOfPlayers}`);
        if (this.state.selectedNumberOfPlayers > 3)
            this.goToPlayerDataScreen();
        else
            this.setErrorMessage('Selezionare un numero valido di giocatori!');
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
        if (!this.dataAreValid())
            return;

        let alivePlayers = this.state.playerNames;
        this.setState({alivePlayers: alivePlayers});
        this.goToNightWolvesPhase();
    }

    dataAreValid(){
        return this.isNumberOfWolvesAcceptable() &&
               this.allPlayersHaveNames() &&
               this.allNamesAreUnique();
    }

    confirmKillSelection(event){
        //console.log(`${event.target.value} has been chosen as victim`);

        if(this.state.currentPhase === 2)
            this.setState({wolvesKill: event.target.value });
        else if(this.state.currentPhase === 3)
            this.setState({commonersKill: event.target.value });
    }

    handleWolvesChoice(){
        const victim = this.state.wolvesKill;
        console.log(`Set ${victim} as wolves' choice`);
        if (!this.isVictimValid(victim))
          return;

        this.removeFromAlivePlayers(victim);
        this.goToDayPhase();
    }

    handleCommonersChoice(){
        const victim = this.state.commonersKill;
        console.log(`Set ${victim} as commoners' choice`);
        if (!this.isVictimValid(victim))
            return;

        this.removeFromAlivePlayers(victim);
        this.goToNightWolvesPhase();
    }

    setErrorMessage(message){
        console.log(`Setting error to: ${message}`);
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

    allNamesAreUnique(){
        let names = this.state.playerNames;

        for(let i = 0; i < names.length; i++) {
            if(names.filter(item => item !== names[i]).length <= (names.length - 2)) {
                this.setErrorMessage('Tutti i giocatori devono avere un nome unico!');
                return false;
            }
        }

        return true;
    }

    isNumberOfWolvesAcceptable(){
        let wolves = 0;
        const maxNumberOfWolves = Math.round(this.state.selectedNumberOfPlayers / 3);

        for(let i = 0; i < this.state.selectedNumberOfPlayers; i++) {
            if (this.state.playerRoles[i] === this.state.roles.getRoleByName('lupo'))
                wolves++;
        }

        if (wolves === 0) {
            this.setErrorMessage('Ci deve essere almeno un lupo!');
            return false;
        }

        if (wolves > maxNumberOfWolves) {
            this.setErrorMessage('Ci sono troppi lupi per il numero di giocatori selezionato!');
            return false;
        }

        return true;
    }

    allPlayersHaveNames(){
        if (this.state.playerNames.length === 0) {
            this.setErrorMessage('Tutti i giocatori devono avere un nome!');
            return false;
        }

        for(let i = 0; i < this.state.selectedNumberOfPlayers; i++) {
            if (this.state.playerNames[i] === undefined) {
                this.setErrorMessage('Tutti i giocatori devono avere un nome!');
                return false;
            }
        }

        return true;
    }

    isVictimValid(victim){
        console.log(`isVictimValid: chosen victim ${victim}`);
        if (victim === undefined || victim === '') {
            this.setErrorMessage('Selezionare una vittima valida!');
            return false;
        }

        // TODO quando ci saranno altri ruoli

        return true;
    }

    removeFromAlivePlayers(victim) {
        let alivePlayers = this.state.alivePlayers.filter(name => name !== victim);
        this.setState({alivePlayers: alivePlayers});

        if (this.haveWon())
            this.goToEndGameScreen();
    }

    render() {
        const maxNumberOfPlayers = 9;
        const headerTitle = 'Welcome to Lupus in Fabula!';
        let currentPhase = this.state.currentPhase;

        let returnValue;

        if (this.state.error)
            returnValue = <ErrorScreen
                            errorMessage={this.state.errorMessage}
                            goBack={this.resetError}
                          />;

        else if (currentPhase === 0)
            returnValue = <PlayerSelectionScreen
                            maxPlayers={maxNumberOfPlayers}
                            handleNumberOfPlayersSelection={this.handleNumberOfPlayersSelection}
                            selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                            handleNumberOfPlayersConfirm={this.handleNumberOfPlayersConfirm}
                          />;

        else if (currentPhase === 1)
            returnValue = <PlayerNamesScreen
                            selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                            goBack={this.goToPreviousPhase}
                            handlePlayerRoleSelection={this.handlePlayerRoleSelection}
                            handlePlayerNameChange={this.handlePlayerNameChange}
                            handlePlayerDataConfirm={this.handlePlayerDataConfirm}
                            playerNames={this.state.playerNames}
                            playerRoles={this.state.playerRoles}
                          />;

        else if (currentPhase === 2)
            returnValue = <NightWolvesPhaseScreen
                            alivePlayers={this.state.alivePlayers}
                            playerRoles={this.state.playerRoles}
                            confirmKillSelection={this.confirmKillSelection}
                            handleWolvesChoice={this.handleWolvesChoice}
                          />;

        else if (currentPhase === 3)
            returnValue = <DayPhaseScreen
                            wolvesKill={this.state.wolvesKill}
                            alivePlayers={this.state.alivePlayers}
                            confirmKillSelection={this.confirmKillSelection}
                            handleCommonersChoice={this.handleCommonersChoice}
                          />;



        return (
          <div className="col-xs-12">
              <Header title={headerTitle}/>
              {returnValue}
          </div>
        );
  }

    haveWon() {
        if (this.thereAreNotAnyCommonersLeft());
            // TODO Wolves have won
    }

    goToEndGameScreen(winners) {
        console.log(`Congratulations ${winners}!`);
    }

    thereAreNotAnyCommonersLeft(){
        return this.state.alivePlayers.
    }

    lastElementOf(array) {
        return array[array.length - 1];
    }
}

export default Game;
