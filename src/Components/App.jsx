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
import Phases from "./Phases";
import NightSeerScreen from "./NightSeerScreen";
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
        this.handleGuardSelection = this.handleGuardSelection.bind(this);
        this.confirmGuardChoice = this.confirmGuardChoice.bind(this);
        this.handleWhoreSelection= this.handleWhoreSelection.bind(this);
        this.confirmWhoreChoice = this.confirmWhoreChoice.bind(this);
        this.handleSeerSelection= this.handleSeerSelection.bind(this);
        this.confirmSeerChoice = this.confirmSeerChoice.bind(this);
        this.setRandomRoles = this.setRandomRoles.bind(this);
    }

    constructor(){
        super();

        this.state = {
            roles: new Roles(),
            phases: new Phases(),
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
            winnerMessage: '',
            seerChoice: '',
            seerMessage: ''
        };

        this.setUpHandlers();


    }

    render() {
        const maxNumberOfPlayers = 12;
        const headerTitle = 'Welcome to Lupus in Fabula!';
        let currentPhase = this.state.currentPhase;
        let roles = this.state.roles;
        let phases = this.state.phases;

        let returnValue;

        if (this.state.error)
            returnValue = <ErrorScreen
                errorMessage={this.state.errorMessage}
                goBack={this.resetError}
            />;

        else if (currentPhase === phases.getPlayerSelectionPhase())
            returnValue = <PlayerSelectionScreen
                maxPlayers={maxNumberOfPlayers}
                handleNumberOfPlayersSelection={this.handleNumberOfPlayersSelection}
                selectedNumberOfPlayers={this.state.selectedNumberOfPlayers}
                handleNumberOfPlayersConfirm={this.handleNumberOfPlayersConfirm}
            />;

        else if (currentPhase === phases.getPlayerDataPhase())
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

        else if (currentPhase === phases.getGuardPhase())
            returnValue = <NightSpecialCharacterScreen
                alivePlayers={this.state.alivePlayers}
                isPlaying={this.isRolePlaying(roles.getGuardRole())}
                playerNames={this.state.playerNames}
                playerRoles={this.state.playerRoles}
                handleSelection={this.handleGuardSelection}
                confirmChoice={this.isRolePlaying(roles.getGuardRole()) ? this.confirmGuardChoice : this.goToNextPhase}
                specialRole={this.state.roles.getGuardRole()}
                aliveMessage={'pick someone to protect'}
                key={'Guard'}
            />;

        else if (currentPhase === phases.getWhorePhase())
            returnValue = <NightSpecialCharacterScreen
                alivePlayers={this.state.alivePlayers}
                isPlaying={this.isRolePlaying(roles.getWhoreRole())}
                playerNames={this.state.playerNames}
                playerRoles={this.state.playerRoles}
                handleSelection={this.handleWhoreSelection}
                confirmChoice={this.isRolePlaying(roles.getWhoreRole()) ? this.confirmWhoreChoice : this.goToNextPhase}
                specialRole={this.state.roles.getWhoreRole()}
                aliveMessage={'pick someone to have fun with tonight'}
                key={'Whore'}
            />;

        else if (currentPhase === phases.getSeerPhase())
            returnValue = <NightSeerScreen
                alivePlayers={this.state.alivePlayers}
                isPlaying={this.isRolePlaying(roles.getSeerRole())}
                playerNames={this.state.playerNames}
                playerRoles={this.state.playerRoles}
                handleSelection={this.handleSeerSelection}
                continueAction={this.goToNextPhase}
                key={this.state.seerMessage}
                confirmChoice={this.confirmSeerChoice}
                supplementMessage={this.state.seerMessage}
                choice={this.state.seerChoice}
            />;

        else if (currentPhase === phases.getWolvesPhase())
            returnValue = <NightWolvesPhaseScreen
                alivePlayers={this.state.alivePlayers}
                playerRoles={this.state.playerRoles}
                playerNames={this.state.playerNames}
                confirmKillSelection={this.confirmKillSelection}
                handleWolvesChoice={this.handleWolvesChoice}
            />;

        else if (currentPhase === phases.getDayPhase()) {
            returnValue = <DayPhaseScreen
                wolvesKills={this.state.wolvesKills}
                alivePlayers={this.state.alivePlayers}
                confirmKillSelection={this.confirmKillSelection}
                handleCommonersChoice={this.handleCommonersChoice}
                gameEnded={this.gameEnded(this.state.alivePlayers)}
            />;
        }

        else if (currentPhase === phases.getEndGamePhase())
            returnValue = <EndGame message={this.state.winnerMessage}/>;

        return (
            <div className="col-xs-12">
                <Header title={headerTitle}/>
                {returnValue}
            </div>
        );
    }

    goToNextPhase() {
        let currentPhase = this.state.currentPhase;
        const guardPhase = this.state.phases.getGuardPhase();
        const dayPhase = this.state.phases.getDayPhase();

        if (currentPhase === dayPhase && !this.gameEnded(this.state.alivePlayers)) {
            this.setState({currentPhase: guardPhase});
            return;
        }

        this.setState({currentPhase: currentPhase + 1});
    }

    goToPreviousPhase() {
        let currentPhase = this.state.currentPhase;
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
            this.goToNextPhase();
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

        this.goToNextPhase();
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

        if (this.state.currentPhase === this.state.phases.getWolvesPhase())
            this.setState({
                wolvesKills: newVictims,
                commonersKill: ''
            });

        else if (this.state.currentPhase === this.state.phases.getDayPhase())
            this.setState({
                commonersKill: event.target.value,
                wolvesKills: [],
                guardedPlayer: '',
                escortedPlayer: '',
                seerMessage: '',
                seerChoice: ''
            });
    }

    handleWolvesChoice(){
        let victims = this.state.wolvesKills;
        if (!this.areVictimsValid(victims)) {
            return;
        }

        if (!this.doVictimsDie(victims)) {
            this.goToNextPhase();
            return;
        }

        //console.log(`Set ${victims.join()} as wolves' choice`);
        const alivePlayers = this.removeFromAlivePlayers(victims);

        //console.log(`[handleWolvesChoice] alivePlayers: ${alivePlayers}`);

        let winners = this.gameEnded(alivePlayers);

        if (winners)
            this.goToEndGameScreen(winners);
        else
            this.goToNextPhase();
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
            this.goToNextPhase();
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
                this.setErrorMessage('All players must have a unique name');
                return false;
            }
        }

        return true;
    }

    isNumberOfWolvesAcceptable(){
        let wolves = 0;
        const maxNumberOfWolves = this.state.roles.getMaxNumberOfWolvesGivenPlayers(this.state.selectedNumberOfPlayers);

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
        this.setState({currentPhase: this.state.phases.getEndGamePhase()});
    }

    handleGuardSelection(event) {
        console.log(`[handleGuardSelection][guardedPlayer]: ${event.target.value}`);
        this.setState({guardedPlayer: event.target.value});
    }

    confirmGuardChoice() {
        if (this.isUndefinedOrEmpty(this.state.guardedPlayer) &&
        this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getGuardRole()).length > 0) {
            this.setErrorMessage('Select a player!');
            return false;
        }

        this.goToNextPhase();
    }

    handleWhoreSelection(event) {
        //console.log(`[handleWhoreSelection][escortedPlayer]: ${event.target.value}`);
        this.setState({escortedPlayer: event.target.value});
    }

    confirmWhoreChoice() {
        if (this.isUndefinedOrEmpty(this.state.escortedPlayer) &&
        this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getWhoreRole()).length > 0) {
            this.setErrorMessage('Select a player!');
            return false;
        }

        this.goToNextPhase();
    }

    confirmSeerChoice() {
        if (this.isUndefinedOrEmpty(this.state.seerChoice) &&
        this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getSeerRole()).length > 0) {
            this.setErrorMessage('Select a player!');
            return false;
        }

        let chosenIsWolf = this.getAlivePlayersByRole(this.state.alivePlayers, this.state.roles.getWolfRole())
                                .includes(this.state.seerChoice);

        //console.log('ChosenIsWolf: ' + chosenIsWolf);
        this.setState({ seerMessage: chosenIsWolf });
    }

    handleSeerSelection(event) {
        this.setState({seerChoice: event.target.value});
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
        // TODO Ampliare questa, se serve, ogni volta che si aggiunge un ruolo

        const commonerRole = this.state.roles.getDefaultRole();
        const guardRole = this.state.roles.getGuardRole();
        const whoreRole = this.state.roles.getWhoreRole();
        const seerRole = this.state.roles.getSeerRole();

        return this.getAlivePlayersByRole(alivePlayers, commonerRole)
                   .concat(this.getAlivePlayersByRole(alivePlayers, guardRole))
                   .concat(this.getAlivePlayersByRole(alivePlayers, whoreRole))
                   .concat(this.getAlivePlayersByRole(alivePlayers, seerRole));
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
