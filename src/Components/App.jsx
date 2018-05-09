import React, { Component } from 'react';
import PlayerSelectionScreen from './PlayerSelectionScreen';
import PlayerNamesScreen from './PlayerNamesScreen';
import ErrorScreen from "./ErrorScreen";
import Header from "./Header";
import Roles from "./Roles";
import NightWolvesPhaseScreen from "./NightWolvesPhaseScreen"
import DayPhaseScreen from "./DayPhaseScreen"
import EndGame from "./EndGame";
import NightGuardPhaseScreen from "./NightGuardPhaseScreen";
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
        this.confirmGuardSelection = this.confirmGuardSelection.bind(this);
        this.handleGuardChoice = this.handleGuardChoice.bind(this);
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
            commonersKill: '',
            guardedPlayer: '',
            winnerMessage: ''
        };

        this.setUpHandlers();
    }

    goToPlayerDataScreen(){
        //console.log(`Setting phase to: 1`);
        this.setState({currentPhase: 1});
    }

    goToPreviousPhase(){
        let newIndex = this.state.currentPhase - 1;
        //console.log(`Setting phase to: ${newIndex}`);
        this.setState({currentPhase: newIndex});
    }

    goToNightWolvesPhase() {
        //console.log(`Setting phase to: 2`);
        this.setState({currentPhase: 2});
    }

    goToNightGuardPhase() {
        //console.log(`Setting phase to: 1.1`);
        this.setState({currentPhase: 1.1});
    }

    goToDayPhase(){
        //console.log(`Setting phase to: 3`);
        this.setState({currentPhase: 3});
    }

    resetError(){
        //console.log(`Resetting error`);
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

        this.goToFirstNightPhase(alivePlayers);
    }

    dataAreValid(){
        return this.isNumberOfWolvesAcceptable() &&
               this.allPlayersHaveNames() &&
               this.allNamesAreUnique() &&
               this.uniqueRolesAreNotUnique();
    }

    confirmKillSelection(event){
        //console.log(`${event.target.value} has been chosen as victim`);

        if(this.state.currentPhase === 2)
            this.setState({wolvesKill: event.target.value });
        else if(this.state.currentPhase === 3) {
            this.setState({
                commonersKill: event.target.value,
                guardedPlayer: ''
            });
        }
    }

    handleWolvesChoice(){
        let victim = this.state.wolvesKill;
        if (!this.isVictimValid(victim)) {
            return;
        }

        if (!this.doesVictimDie(victim)) {
            this.goToDayPhase();
            return;
        }

        console.log(`Set ${victim} as wolves' choice`);
        const alivePlayers = this.removeFromAlivePlayers(victim);

        //console.log(`[handleWolvesChoice] alivePlayers: ${alivePlayers}`);

        let winners = this.gameEnded(alivePlayers);

        if (winners)
            this.goToEndGameScreen(winners);
        else
            this.goToDayPhase();
    }

    handleCommonersChoice(){
        const victim = this.state.commonersKill;
        console.log(`Set ${victim} as commoners' choice`);

        if (!this.isVictimValid(victim))
            return;

        const alivePlayers = this.removeFromAlivePlayers(victim);

        let winners = this.gameEnded(alivePlayers);

        if (winners)
            this.goToEndGameScreen(winners);
        else {
            this.setState({ wolvesKill: '' });

            this.goToFirstNightPhase(alivePlayers);
        }
    }

    setErrorMessage(message){
        //console.log(`Setting error to: ${message}`);
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

    allPlayersHaveNames() {
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

    uniqueRolesAreNotUnique() {
        let guards = 0;
        for (let i = 0; i < this.state.playerRoles.length; i++) {
            if (this.state.playerRoles[i] === this.state.roles.getGuardRole()) guards++;
        }

        if (guards > 1) {
            this.setErrorMessage('Solo un giocatore può assumere il ruolo della guardia!');
            return false;
        }

        return true;
    }

    isVictimValid(victim){
        //console.log(`isVictimValid: chosen victim ${victim}`);
        if (victim === undefined || victim === '') {
            this.setErrorMessage('Selezionare una vittima valida!');
            return false;
        }

        return true;
    }

    doesVictimDie(victim){
        //console.log(`isVictimValid: chosen victim ${victim}`);
        //this.isVictimValid(victim);

        // TODO ampliare quando ci saranno altri ruoli

        if (this.state.guardedPlayer === victim) {
            this.setState({wolvesKill: ''});
            return false;
        }

        return true;
    }

    removeFromAlivePlayers(victim) {
        let alivePlayers = this.state.alivePlayers.filter(name => name !== victim);
        this.setState({alivePlayers: alivePlayers});
        return alivePlayers;
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

        else if (currentPhase === 1.1)
            returnValue = <NightGuardPhaseScreen
                alivePlayers={this.state.alivePlayers}
                playerNames={this.state.playerNames}
                playerRoles={this.state.playerRoles}
                confirmGuardSelection={this.confirmGuardSelection}
                handleGuardChoice={this.handleGuardChoice}
            />;

        else if (currentPhase === 2)
            returnValue = <NightWolvesPhaseScreen
                            alivePlayers={this.state.alivePlayers}
                            playerRoles={this.state.playerRoles}
                            playerNames={this.state.playerNames}
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

        else if (currentPhase === 4)
            returnValue = <EndGame message={this.state.winnerMessage}/>;

        return (
          <div className="col-xs-12">
              <Header title={headerTitle}/>
              {returnValue}
          </div>
        );
  }

    gameEnded(alivePlayers) {
        if (this.wolvesHaveWon(alivePlayers))
            return 'wolves';
        if (this.commonersHaveWon(alivePlayers))
            return 'commoners';

        return false;
    }

    goToEndGameScreen(winners) {
        //console.log(`*** CONGRATULATIONS ${winners}! ***`);
        this.setWinnerMessage(winners);
        this.setState({currentPhase: 4});
    }

    confirmGuardSelection(event) {
        console.log(`[confirmGuardSelection][guardedPlayer]: ${event.target.value}`);
        this.setState({guardedPlayer: event.target.value});
    }

    handleGuardChoice() {
        console.log("[handleGuardChoice] Going to NightWolves phase");

        if (this.state.guardedPlayer === undefined || this.state.guardedPlayer === '') {
            this.setErrorMessage('Selezionare un giocatore!');
            return false;
        }

        this.setState({currentPhase: 2});
    }

    wolvesHaveWon(alivePlayers) {
        const wolfRole = this.state.roles.getRoleByName('lupo');
        let wolves = this.getAlivePlayersByRole(alivePlayers, wolfRole);

        // Filtrare per alivePlayers - wolves, per qualche motivo, non funziona
        let commoners = this.getCommonersSide(alivePlayers);

        //console.log(`Wolves: ${wolves}`);
        //console.log(`Commoners: ${commoners}`);

        return wolves.length >= commoners.length;
    }

    getAlivePlayersByRole(alivePlayers, role) {
        let result = [];

        for(let i = 0; i < this.state.playerRoles.length; i++)
            if (this.state.playerRoles[i] === role && alivePlayers.includes(this.state.playerNames[i]))
                result.push(this.state.playerNames[i]);

        return result;
    }

    getCommonersSide(alivePlayers) {
        const commonerRole = this.state.roles.getDefaultRole();
        const guardRole = this.state.roles.getGuardRole();
        return this.getAlivePlayersByRole(alivePlayers, commonerRole)
                   .concat(this.getAlivePlayersByRole(alivePlayers, guardRole));
    }

    isGuardAlive(alivePlayers) {
        const players = alivePlayers === undefined ? this.state.alivePlayers : alivePlayers;

        //console.log(`[isGuardAlive]: ${this.getAlivePlayersByRole(players, this.state.roles.getGuardRole()).length !== 0}`);
        //console.log(`[isGuardAlive][alivePlayers]: ${players}`);
        //console.log(`[isGuardAlive][Guard]: ${this.getAlivePlayersByRole(players, this.state.roles.getGuardRole())}`);

        return this.getAlivePlayersByRole(players, this.state.roles.getGuardRole()).length !== 0;
    }

    commonersHaveWon(alivePlayers) {
        const commonerRole = this.state.roles.getDefaultRole();
        let goodGuys = this.getCommonersSide(alivePlayers, commonerRole);

        //console.log(`[commonersHaveWon][goodGuys]: ${goodGuys}`);

        return this.arrayAreEqual(alivePlayers, goodGuys);
    }

    setWinnerMessage(winner){
        const winnerMessage = `${winner} have won!`;
        this.setState({winnerMessage: winnerMessage});
    }

    arrayAreEqual(a1, a2) {
        return a1.length === a2.length &&
               a1.every(element => a2.includes(element));
    }

    goToFirstNightPhase(alivePlayers) {
        this.isGuardAlive(alivePlayers) ?
            this.goToNightGuardPhase() :
            this.goToNightWolvesPhase();
    }
}

export default Game;
