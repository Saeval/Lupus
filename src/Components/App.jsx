import React, { Component } from 'react';
import PlayerSelectionScreen from './PlayerSelectionScreen';
import PlayerNamesScreen from './PlayerNamesScreen';
import ErrorScreen from "./ErrorScreen";
import Header from "./Header";
import Roles from "./Roles";
import NightWolvesPhaseScreen from "./NightWolvesPhaseScreen"
import DayPhaseScreen from "./DayPhaseScreen"
import EndGame from "./EndGame";
import NightSpecialCharacterScreen from "./NightSpecialCharacterScreen";
//import './fonts/glyphicons-halflings-regular.eot';

class Game extends Component {

    setUpHandlers(){
        this.resetError = this.resetError.bind(this);
        this.goToNextPhase = this.goToNextPhase.bind(this);
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
        this.confirmWhoreSelection= this.confirmWhoreSelection.bind(this);
        this.handleWhoreChoice = this.handleWhoreChoice.bind(this);
        this.setRandomRoles = this.setRandomRoles.bind(this);
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
            wolvesKills: [],
            commonersKill: '',
            guardedPlayer: '',
            escortedPlayer: '',
            winnerMessage: ''
        };

        this.setUpHandlers();
    }

    render() {
        const maxNumberOfPlayers = 12;
        const headerTitle = 'Welcome to Lupus in Fabula!';
        let currentPhase = this.state.currentPhase;
        let roles = this.state.roles;

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
                setRandomRoles={this.setRandomRoles}
            />;

        else if (currentPhase === 1.1)
            returnValue = <NightSpecialCharacterScreen
                alivePlayers={this.state.alivePlayers}
                playerNames={this.state.playerNames}
                playerRoles={this.state.playerRoles}
                confirmSelection={this.confirmGuardSelection}
                handleChoice={this.isRolePlaying(roles.getGuardRole()) ? this.handleGuardChoice : this.goToNextPhase}
                specialRole={this.state.roles.getGuardRole()}
                aliveMessage={'pick someone to protect'}
                key={'Guard'}
            />;

        else if (currentPhase === 1.2)
            returnValue = <NightSpecialCharacterScreen
                alivePlayers={this.state.alivePlayers}
                playerNames={this.state.playerNames}
                playerRoles={this.state.playerRoles}
                confirmSelection={this.confirmWhoreSelection}
                handleChoice={this.isRolePlaying(roles.getWhoreRole()) ? this.handleWhoreChoice : this.goToNextPhase}
                specialRole={this.state.roles.getWhoreRole()}
                aliveMessage={'pick someone to have fun with tonight'}
                key={'Whore'}
            />;

        else if (currentPhase === 2)
            returnValue = <NightWolvesPhaseScreen
                alivePlayers={this.state.alivePlayers}
                playerRoles={this.state.playerRoles}
                playerNames={this.state.playerNames}
                confirmKillSelection={this.confirmKillSelection}
                handleWolvesChoice={this.handleWolvesChoice}
            />;

        else if (currentPhase === 3) {
            returnValue = <DayPhaseScreen
                wolvesKills={this.state.wolvesKills}
                alivePlayers={this.state.alivePlayers}
                confirmKillSelection={this.confirmKillSelection}
                handleCommonersChoice={this.handleCommonersChoice}
            />;
        }

        else if (currentPhase === 4)
            returnValue = <EndGame message={this.state.winnerMessage}/>;

        return (
            <div className="col-xs-12">
                <Header title={headerTitle}/>
                {returnValue}
            </div>
        );
    }

    goToNextPhase(alivePlayers) {
        let currentPhase = this.state.currentPhase;
        const guard = this.state.roles.getGuardRole();
        const whore = this.state.roles.getWhoreRole();

        if (currentPhase === 0)
            this.setState({currentPhase: 1});

        else if (currentPhase === 1 && this.isRolePlaying(guard))
            this.setState({currentPhase: 1.1});

        else if (currentPhase === 1 && this.isRolePlaying(whore))
            this.setState({currentPhase: 1.2});

        else if (currentPhase === 1)
            this.setState({currentPhase: 2});

        else if (currentPhase === 1.1 && this.isRolePlaying(whore))
            this.setState({currentPhase: 1.2});

        else if (currentPhase === 1.1)
            this.setState({currentPhase: 2});

        else if (currentPhase === 1.2)
            this.setState({currentPhase: 2});

        else if (currentPhase === 2)
            this.setState({currentPhase: 3});

        else if (currentPhase === 3 && this.gameEnded(alivePlayers))
            this.setState({currentPhase: 4});

        else if (currentPhase === 3 && this.isRolePlaying(guard))
            this.setState({currentPhase: 1.1});

        else if (currentPhase === 3 && this.isRolePlaying(whore))
            this.setState({currentPhase: 1.2});

        else if (currentPhase === 3)
            this.setState({currentPhase: 2});
    }

    goToPreviousPhase() {
        let currentPhase = this.state.currentPhase;

        if (currentPhase === 1 || currentPhase === 2)
            this.setState({currentPhase: currentPhase - 1});
    }

    isRolePlaying(role) {
        return this.getNumberOfPlayersWithRole(role) > 0;
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
        if (this.state.selectedNumberOfPlayers >= 6)
            this.goToNextPhase(this.state.alivePlayers);
        else
            this.setErrorMessage('Select a proper number of players!');
    }

    handlePlayerRoleSelection(event){
        let newRoles = this.state.playerRoles;
        let selectedRole = event.target.value;
        let position = event.target.id.split('-')[1];

        newRoles[position] = selectedRole;

        this.setState({ playerRoles: newRoles });
    }

    setRandomRoles() {
        const roles = this.state.roles;
        let newRoles = this.state.playerRoles;
        const numberOfPlayers = this.state.selectedNumberOfPlayers;

        const maxNumberOfWolves = roles.getMaxNumberOfWolvesGivenPlayers(numberOfPlayers);
        const maxNumberOfGuard = roles.getMaxNumberOfGuards();
        const maxNumberOfWhores = roles.getMaxNumberOfWhores();
        const maxNumberOfCommoners = roles.getMaxNumberOfCommoners(numberOfPlayers);

        this.removeDefaultCommonerRole(newRoles);

        //console.log(newRoles);

        for (let i = 0; i < numberOfPlayers; i++) {
            let remainingRolesToAssign = [];

            let currentNumberOfWolves = this.getNumberOfPlayersWithRole(roles.getWolfRole(), newRoles);
            let currentNumberOfGuards = this.getNumberOfPlayersWithRole(roles.getGuardRole(), newRoles);
            let currentNumberOfWhores = this.getNumberOfPlayersWithRole(roles.getWhoreRole(), newRoles);
            let currentNumberOfCommoners = this.getNumberOfPlayersWithRole(roles.getDefaultRole(), newRoles);

            this.addRoles(maxNumberOfWolves - currentNumberOfWolves, remainingRolesToAssign, roles.getWolfRole());
            this.addRoles(maxNumberOfGuard - currentNumberOfGuards, remainingRolesToAssign, roles.getGuardRole());
            this.addRoles(maxNumberOfWhores - currentNumberOfWhores, remainingRolesToAssign, roles.getWhoreRole());
            this.addRoles(maxNumberOfCommoners - currentNumberOfCommoners, remainingRolesToAssign, roles.getDefaultRole());

            newRoles[i] = remainingRolesToAssign[Math.floor(Math.random() * remainingRolesToAssign.length)];
        }

        //console.log(newRoles);
        this.setState({ playerRoles: newRoles });
    }

    getNumberOfPlayersWithRole(roleToGet, currentRoles) {
        currentRoles = currentRoles === undefined ? this.state.playerRoles : currentRoles;
        return currentRoles.filter(role => role === roleToGet).length;
    }

    addRoles(numberOfTimesToAdd, remainingRolesToAssign, role) {
        for (let i = 0; i < numberOfTimesToAdd; i++)
            remainingRolesToAssign.push(role);
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

        this.goToNextPhase(alivePlayers);
    }

    dataAreValid() {
        return this.isNumberOfWolvesAcceptable() &&
            this.allPlayersHaveNames() &&
            this.allNamesAreUnique() &&
            this.uniqueRolesAreReallyUnique();
    }

    confirmKillSelection(event){
        //console.log(`[${event.target.value}] has been chosen as victim`);
        let newVictims = this.state.wolvesKills;

        if (this.isUndefinedOrEmpty(event.target.value))
            newVictims = [];
        else
            newVictims.push(event.target.value);

        if (this.state.currentPhase === 2)
            this.setState({wolvesKills: newVictims });
        else if (this.state.currentPhase === 3) {
            this.setState({
                commonersKill: event.target.value,
                wolvesKills: [],
                guardedPlayer: '',
                escortedPlayer: ''
            });
        }
    }

    handleWolvesChoice(){
        let victims = this.state.wolvesKills;
        if (!this.areVictimsValid(victims)) {
            return;
        }

        if (!this.doVictimsDie(victims)) {
            this.goToNextPhase(this.state.alivePlayers);
            return;
        }

        //console.log(`Set ${victims.join()} as wolves' choice`);
        const alivePlayers = this.removeFromAlivePlayers(victims);

        //console.log(`[handleWolvesChoice] alivePlayers: ${alivePlayers}`);

        let winners = this.gameEnded(alivePlayers);

        if (winners)
            this.goToEndGameScreen(winners);
        else
            this.goToNextPhase(alivePlayers);
    }

    handleCommonersChoice(){
        const victim = this.state.commonersKill;
        //console.log(`Set ${victim} as commoners' choice`);

        if (!this.areVictimsValid(victim))
            return;

        const alivePlayers = this.removeFromAlivePlayers(victim);

        let winners = this.gameEnded(alivePlayers);

        if (winners)
            this.goToEndGameScreen(winners);
        else {
            this.setState({ wolvesKills: [] });
            this.goToNextPhase(alivePlayers);
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

        this.resetDataForPlayersNonExistentAnymore(numberOfPlayers, tempNames, tempRoles);

        this.setState({ playerNames: tempNames });
        this.setState({ playerRoles: tempRoles });
    }

    resetDataForPlayersNonExistentAnymore(numberOfPlayers, tempNames, tempRoles) {
        if (this.state.playerRoles.length > numberOfPlayers) {
            for (let i = numberOfPlayers; i < this.state.playerRoles.length; i++) {
                tempNames.pop();
                tempRoles.pop();
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
            if (this.state.playerRoles[i] === this.state.roles.getRoleByName('wolf'))
                wolves++;
        }

        if (wolves === 0) {
            this.setErrorMessage('At least a wolf has to be present');
            return false;
        }

        if (wolves > maxNumberOfWolves) {
            this.setErrorMessage('There are too many wolves for the number of players selected');
            return false;
        }

        return true;
    }

    allPlayersHaveNames() {
        if (this.state.playerNames.length === 0) {
            this.setErrorMessage('All players must have a name');
            return false;
        }

        for(let i = 0; i < this.state.selectedNumberOfPlayers; i++) {
            if (this.isUndefinedOrEmpty(this.state.playerNames[i])) {
                this.setErrorMessage('All players must have a name!');
                return false;
            }
        }

        return true;
    }

    uniqueRolesAreReallyUnique() {
        let guards = this.getAlivePlayersByRole(this.state.playerNames, this.state.roles.getGuardRole()).length;
        let whores = this.getAlivePlayersByRole(this.state.playerNames, this.state.roles.getWhoreRole()).length;

        if (guards > 1) {
            this.setErrorMessage(`Only a player can play as the ${this.state.roles.getGuardRole().toLowerCase()}!`);
            return false;
        }

        if (whores > 1) {
            this.setErrorMessage(`Only a player can play as the ${this.state.roles.getWhoreRole().toLowerCase()}!`);
            return false;
        }

        return true;
    }

    areVictimsValid(victims){
        //console.log(`isVictimValid: chosen victim ${victims}`);
        if (this.isUndefinedOrEmpty(victims)) {
            this.setErrorMessage('Select a valid victim!');
            return false;
        }

        return true;
    }

    doVictimsDie(victims){
        //console.log(`areVictimsValid: chosen victim ${victim}`);

        // TODO ampliare quando ci saranno altri ruoli

        if (victims.includes(this.state.guardedPlayer)) {
            this.setState({wolvesKills: []});
            return false;
        }

        let whore = this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getWhoreRole())[0];
        let wolves = this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getWolfRole());

        if (victims.includes(whore)) {
            this.setState({ wolvesKills: [] });
            return false;
        }

        this.killWhoreIfSheSleptWithWolf(wolves, whore);
        this.killAlsoWhoreIfEscortedPlayerIsBetweenVictims(victims, whore);

        return true;
    }

    removeFromAlivePlayers(victims) {
        //console.log(`[removeFromAlivePlayers][victims]: ${victims}`);
        //console.log(`[removeFromAlivePlayers][victims.length]: ${victims.length}`);
        //console.log(`[removeFromAlivePlayers][this.state.alivePlayers]: ${this.state.alivePlayers}`);

        let alivePlayers = this.state.alivePlayers.filter(name => !victims.includes(name));

        //console.log(`[removeFromAlivePlayers][alivePlayers]: ${alivePlayers}`);

        this.setState({alivePlayers: alivePlayers});
        return alivePlayers;
    }

    gameEnded(alivePlayers) {
        if (this.wolvesHaveWon(alivePlayers))
            return 'Wolves';
        if (this.commonersHaveWon(alivePlayers))
            return 'Commoners';

        return false;
    }

    goToEndGameScreen(winners) {
        //console.log(`*** CONGRATULATIONS ${winners}! ***`);
        this.setWinnerMessage(winners);
        this.setState({currentPhase: 4});
    }

    confirmGuardSelection(event) {
        //console.log(`[confirmGuardSelection][guardedPlayer]: ${event.target.value}`);
        this.setState({guardedPlayer: event.target.value});
    }

    handleGuardChoice() {
        if (this.isUndefinedOrEmpty(this.state.guardedPlayer) &&
        this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getGuardRole()).length > 0) {
            this.setErrorMessage('Select a player!');
            return false;
        }

        this.goToNextPhase(this.state.alivePlayers);
    }

    confirmWhoreSelection(event) {
        //console.log(`[confirmWhoreSelection][escortedPlayer]: ${event.target.value}`);
        this.setState({escortedPlayer: event.target.value});
    }

    handleWhoreChoice() {
        if (this.isUndefinedOrEmpty(this.state.escortedPlayer) &&
        this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getWhoreRole()).length > 0) {
            this.setErrorMessage('Select a player!');
            return false;
        }

        this.setState({currentPhase: 2});
    }

    wolvesHaveWon(alivePlayers) {
        const wolfRole = this.state.roles.getRoleByName('wolf');
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
        const whoreRole = this.state.roles.getWhoreRole();
        return this.getAlivePlayersByRole(alivePlayers, commonerRole)
                   .concat(this.getAlivePlayersByRole(alivePlayers, guardRole))
                   .concat(this.getAlivePlayersByRole(alivePlayers, whoreRole));
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

    removeDefaultCommonerRole(newPlayerRoles) {
        for (let i = 0; i < newPlayerRoles.length; i++)
            newPlayerRoles[i] = '';
    }

    isUndefinedOrEmpty(object) {
        //console.log(`[isUndefinedOrEmpty]: [${object}]`);
        return object === undefined ||
                object === null ||
                object === '' ||
                object === [] ||
                object.length === 0;
    }


    killAlsoWhoreIfEscortedPlayerIsBetweenVictims(victims, whore) {
        if (victims.includes(this.state.escortedPlayer)) {
            //console.log(`[isVictimValid][Adding to wolvesKills]: ${whore}`);
            let newVictims = this.state.wolvesKills;
            newVictims.push(whore);

            this.setState({wolvesKills: newVictims});
        }
    }

    killWhoreIfSheSleptWithWolf(wolves, whore) {
        if (wolves.includes(this.state.escortedPlayer)) {
            //console.log(`[isVictimValid][Adding to wolvesKills]: ${whore}`);
            let newVictims = this.state.wolvesKills;
            newVictims.push(whore);

            this.setState({wolvesKills: newVictims});
        }
    }
}

export default Game;
