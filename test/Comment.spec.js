import React from 'react';
import BackToSelectionButton from '../src/Components/BackToSelectionButton';
import PlayerSelectionScreen from '../src/Components/PlayerSelectionScreen';
import Game from '../src/Components/App';
import PlayerNamesScreen from '../src/Components/PlayerNamesScreen'
import ErrorScreen from "../src/Components/ErrorScreen";
import Header from "../src/Components/Header";
import NightWolvesPhaseScreen from "../src/Components/NightWolvesPhaseScreen";
import DayPhaseScreen from "../src/Components/DayPhaseScreen";
import NightSpecialCharacterScreen from "../src/Components/NightSpecialCharacterScreen";

describe('Header item', () => {
    const title = "A random title";
    let header = shallow(<Header title={title}/>);

    it ('should display correct message', () => {
        expect(header.text()).to.equal(title);
    });
});

describe('BackToSelection item', () => {
    let game = mount(<Game />);
    const backToSelection = shallow(<BackToSelectionButton goBack={game.instance().resetError}/>);

    it('should be a button item', () => {
        expect(backToSelection.type()).to.equal('button');
    });

    it('should go to previous phase', () => {
        game.instance().setState({
            currentPhase: 1,
            error: true,
            errorMessage: "Not empty"
        });

        backToSelection.simulate('click');

        expect(game.state('error')).to.be.false;
        expect(game.state('errorMessage')).to.be.empty;
    });

});

describe('PlayerSelectionScreen item', () => {
    let game = mount(<Game />);
    let selection = game.find('PlayerSelectionScreen');

    it('should have a confirm button', () => {
        AssertElementIsVisible(selection.find('button'));
        expect(selection.find('button').props().className).to.contain('btn-primary');
    });

    it('should have minimum 6 players', () => {
        expect(selection.instance().buildOptions(-1)).to.equal(null);
        expect(selection.instance().buildOptions(3)).to.equal(null);
        expect(selection.instance().buildOptions(6).length).to.equal(6 - 5 + 1);
        expect(selection.instance().buildOptions(9).length).to.equal(9 - 5 + 1);
    });

    it('should keep selected value', () => {
        expect(game.find('PlayerSelectionScreen').find('select').props().defaultValue).to.equal(-1);

        game.instance().setState({ selectedNumberOfPlayers: 6 });

        game.update();

        expect(game.find('PlayerSelectionScreen').find('select').props().defaultValue).to.equal(6);
    });

});

describe('ErrorScreen item', () => {
    const errorMessage = "Something happened";
    const errorScreen = mount(<ErrorScreen errorMessage={errorMessage}/>);

    it('should display error message', () => {
       expect(errorScreen.props().errorMessage).to.equal(errorMessage);
    });

    it('should display button to go back', () => {
        AssertElementIsVisible(errorScreen.find('BackToSelectionButton'));
    });
});

describe('PlayerNamesScreen item', () => {
    const numberOfPlayers = 7;
    let playerNamesScreen = mount(<PlayerNamesScreen selectedNumberOfPlayers={numberOfPlayers}
                                                     playerRoles={[]}
                                                     playerNames={[]}/>);

    it('should create as many inputs as characters selected', () => {
        expect(playerNamesScreen.find('input').length).to.equal(numberOfPlayers);
    });

    /*it('should be able to assign random roles', () => {
        playerNamesScreen.find('.btn-info').simulate('click');
        const expectedElements = ['Commoner', 'Wolf', 'Guard'];

        let actualRoles = playerNamesScreen.state('playerRoles').map(select => select.props.value);
        AssertArrayContains(actualRoles, expectedElements)
    });*/
});

describe('NightWolvesPhaseScreen item', () => {
    let screen = mount(<NightWolvesPhaseScreen
                            alivePlayers={['Nome1', 'Nome2', 'Nome3', 'Nome4']}
                            playerNames={['Nome1', 'Nome2', 'Nome3', 'Nome4']}
                            playerRoles={['Commoner', 'Commoner', 'Commoner', 'Wolf']}
                        />);

    it('should not contain wolves in select', () => {
        expect(screen.find('option').length).to.equal(3 + 1);
        expect(screen.find('option').at(0).text()).to.equal('--');
        expect(screen.find('option').at(1).text()).to.equal('Nome1');
        expect(screen.find('option').at(2).text()).to.equal('Nome2');
        expect(screen.find('option').at(3).text()).to.equal('Nome3');
        expect(screen.find('.col-xs-4').text()).to.contain('Wolf Nome4,');
    });
});

describe('NightSpecialCharacterScreen item', () => {
    let screen = mount(<NightSpecialCharacterScreen
        alivePlayers={['Nome1', 'Nome2', 'Nome3', 'Nome4', 'Nome5']}
        playerNames={['Nome1', 'Nome2', 'Nome3', 'Nome4', 'Nome5']}
        playerRoles={['Commoner', 'Commoner', 'Commoner', 'Wolf', 'Guard']}
        specialRole={'Guard'}
    />);

    it('should not contain guard in select', () => {
        expect(screen.find('option').length).to.equal(4 + 1);
        expect(screen.find('option').at(0).text()).to.equal('--');
        expect(screen.find('option').at(1).text()).to.equal('Nome1');
        expect(screen.find('option').at(2).text()).to.equal('Nome2');
        expect(screen.find('option').at(3).text()).to.equal('Nome3');
        expect(screen.find('option').at(4).text()).to.equal('Nome4');
    });
});

describe('DayPhaseScreen item', () => {
    let screen = mount(<DayPhaseScreen
                            wolvesKills={['Dead']}
                            alivePlayers={['Nome1', 'Nome2', 'Nome3']}
                        />);

    it('should show wolvesKill', () => {
        expect(screen.find('.col-xs-4').text()).to.contain('Dead');
    });

    it('should not contain dead players in select', () => {
        expect(screen.find('option').length).to.equal(3 + 1);
        expect(screen.find('option').at(0).text()).to.equal('--');
        expect(screen.find('option').at(1).text()).to.equal('Nome1');
        expect(screen.find('option').at(2).text()).to.equal('Nome2');
        expect(screen.find('option').at(3).text()).to.equal('Nome3');
    });
});

describe('Game item', () => {
    it('should create as many inputs as characters selected', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        expect(game.find('PlayerSelectionScreen').find('option').first().props().value).to.equal(-1);
        expect(game.find('input').length).to.equal(0);

        goToPlayerNamesScreen(game, numberOfPlayers);

        AssertElementIsVisible(game.find('PlayerNamesScreen'));
        AssertElementDoesNotExist(game.find('ErrorScreen'));
        expect(game.find('input').length).to.equal(numberOfPlayers);
    });

    it('should validate roles considering number of players', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        let playerNamesScreen = goToPlayerNamesScreen(game, numberOfPlayers);

        expect(game.state('playerRoles')[0]).to.equal('Commoner');

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'Alberto', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-3'), 'SAW', 'blur');

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'At least a wolf');
        game.find('ErrorScreen').find('BackToSelectionButton').simulate('click');

        expect(game.find('#name-0').text()).to.be.empty;

        changeElementSettingState(playerNamesScreen.find('#role-0'), 'Wolf', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-1'), 'Wolf', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'too many wolves');
    });

    it('should not accept any blank name fields', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        let playerNamesScreen = goToPlayerNamesScreen(game, numberOfPlayers);

        expect(game.find('#name-0').text()).to.be.empty;
        expect(game.find('#name-1').text()).to.be.empty;
        expect(game.find('#name-2').text()).to.be.empty;
        expect(game.find('#name-3').text()).to.be.empty;
        expect(game.find('#name-4').text()).to.be.empty;
        expect(game.find('#name-5').text()).to.be.empty;

        changeElementSettingState(playerNamesScreen.find('#role-0'), 'Wolf', 'change');
        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'name');

        game.find('ErrorScreen').find('BackToSelectionButton').simulate('click');
        expect(game.find('#name-0').text()).to.be.empty;

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'Alberto', 'blur');
        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'name');
    });

    it('should not let two players to have the same name', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        let playerNamesScreen = goToPlayerNamesScreen(game, numberOfPlayers);

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-5'), 'SAW', 'blur');
        changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-4'), 'Wolf', 'change');

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'nome');
        AssertErrorScreenTextContains(game, 'unico');
    });

    it('should be able to assign roles randomly', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        let playerNamesScreen = goToPlayerNamesScreen(game, numberOfPlayers);

        AssertArrayContains(game.state('playerRoles'), ['Commoner']);
        AssertArrayNotContains(game.state('playerRoles'), ['Wolf', 'Guard']);

        playerNamesScreen.find('.btn-info').simulate('click');

        AssertArrayContains(game.state('playerRoles'), ['Commoner', 'Wolf', 'Guard']);
        expect(game.state('playerRoles').filter(role => role === 'Wolf').length).to.equal(2);
        expect(game.state('playerRoles').filter(role => role === 'Guard').length).to.equal(1);
        expect(game.state('playerRoles').filter(role => role === 'Whore').length).to.equal(1);
        expect(game.state('playerRoles').filter(role => role === 'Commoner').length).to.equal(2);
    });

    it('should not let wolves select first (empty) option', () => {
        let game = mount(<Game />);

        goToNightWolvesPhaseScreen(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'victim');
        AssertErrorScreenTextContains(game, 'valid');

        game.find('ErrorScreen').find('BackToSelectionButton').simulate('click');

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Claudio', 'change');
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(getDayPhaseScreen(game));
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'SAW', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        expect(getNightWolvesPhaseScreen(game).find('option').at(0).text()).to.equal('--');
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(game.find('ErrorScreen'));
    });

    it('should not let guard select first (empty) option', () => {
        let game = mount(<Game />);

        goToNightGuardPhaseScreen(game);
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'player');
    });

    it('should not let whore select first (empty) option', () => {
        let game = mount(<Game />);

        goToNightWhorePhaseScreen(game);
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'player');
        game.find('ErrorScreen').find('BackToSelectionButton').simulate('click');

        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Claudio', 'change');
        ClickConfirmWolvesKill(game);

        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change')
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        ClickConfirmSpecialCharacterChoice(game);
        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'player');
    });

    it('should not show wolves between possible wolves victims', () => {
        let game = mount(<Game />);

        goToNightWolvesPhaseScreen(game);

        const alivePlayers = game.state('alivePlayers');

        AssertArrayContains(alivePlayers, ['Manuel', 'Claudio', 'SAW', 'Alberto', 'Doctor', 'Bonny']);

        const wolvesScreen = getNightWolvesPhaseScreen(game);
        const wolves = [];
        for(let i = 0; i < alivePlayers.length; i++)
            if (game.state('roles').getRoleByName('Wolf') === game.state('playerRoles')[i])
                wolves.push(alivePlayers[i]);

        AssertArrayContains(wolves, ['SAW', 'Doctor']);
        AssertArrayNotContains(wolves, ['Manuel', 'Claudio', 'Alberto', 'Bonny']);
        expect(wolvesScreen.find('option').length).to.equal(4 + 1);
        expect(wolvesScreen.find('option').at(0).text()).to.equal('--');
        expect(wolvesScreen.find('option').at(1).text()).to.equal('Manuel');
        expect(wolvesScreen.find('option').at(2).text()).to.equal('Claudio');
        expect(wolvesScreen.find('option').at(3).text()).to.equal('Alberto');
        expect(wolvesScreen.find('option').at(4).text()).to.equal('Bonny');
    });

    it('should not show dead players between possible commoners victims', () => {
        let game = mount(<Game />);

        goToFirstDayScreen(game);

        const alivePlayers = game.state('alivePlayers');
        const dayScreen = getDayPhaseScreen(game);

        AssertArrayContains(alivePlayers, ['Manuel', 'SAW', 'Alberto', 'Doctor', 'Bonny']);
        AssertArrayNotContains(alivePlayers, ['Claudio']);
        expect(dayScreen.find('option').length).to.equal(5 + 1);
        expect(dayScreen.find('option').at(0).text()).to.equal('--');
        expect(dayScreen.find('option').at(1).text()).to.equal('Manuel');
        expect(dayScreen.find('option').at(2).text()).to.equal('SAW');
        expect(dayScreen.find('option').at(3).text()).to.equal('Alberto');
        expect(dayScreen.find('option').at(4).text()).to.equal('Doctor');
        expect(dayScreen.find('option').at(5).text()).to.equal('Bonny');
    });

    it('should end the game when there are as many commoners as wolves', () => {
        let game = mount(<Game />);

        goToFirstDayScreen(game);

        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'SAW', 'Alberto', 'Doctor', 'Bonny']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Claudio']);

        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Bonny', 'change');
        ClickConfirmCommonersKill(game);

        expect(game.state('alivePlayers').length).to.equal(4);
        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'SAW', 'Alberto', 'Doctor']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Claudio', 'Bonny']);

        AssertElementIsVisible(game.find('EndGame'));
        AssertEndGameScreenContains(game, 'Wolves');
        AssertEndGameScreenContains(game, 'won');
    });

    it('should end the game when there are as many good guys as wolves - Commoners + Guard', () => {
        let game = mount(<Game />);

        goToNightGuardPhaseScreen(game);
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Claudio', 'change');
        ClickConfirmWolvesKill(game);

        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Bonny', 'change');
        ClickConfirmCommonersKill(game);

        expect(game.state('alivePlayers').length).to.equal(4);
        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'SAW', 'Alberto', 'Doctor']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Claudio', 'Bonny']);

        AssertElementIsVisible(game.find('EndGame'));
        AssertEndGameScreenContains(game, 'Wolves');
        AssertEndGameScreenContains(game, 'won');
    });

    it('should end the game when there are as many good guys as wolves - Commoners + Whore', () => {
        let game = mount(<Game />);

        goToNightWhorePhaseScreen(game);
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Claudio', 'change');
        ClickConfirmWolvesKill(game);

        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Bonny', 'change');
        ClickConfirmCommonersKill(game);

        expect(game.state('alivePlayers').length).to.equal(4);
        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'SAW', 'Alberto', 'Doctor']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Claudio', 'Bonny']);

        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmWolvesKill(game);

        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'SAW']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Claudio', 'Bonny', 'Doctor', 'Alberto']);

        AssertElementIsVisible(game.find('EndGame'));
        AssertEndGameScreenContains(game, 'Wolves');
        AssertEndGameScreenContains(game, 'won');
    });

    it('should end the game when there are no more wolves', () => {
        let game = mount(<Game />);

        goToFirstDayScreen(game);

        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'SAW', 'Alberto', 'Doctor', 'Bonny']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Claudio']);

        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmCommonersKill(game);

        AssertWolvesNightPhaseScreenContains(game, 'Wolf SAW');
        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Bonny', 'change');
        ClickConfirmWolvesKill(game);

        AssertDayPhaseScreenContains(game, 'Bonny died');
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'SAW', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(game.find('EndGame'));
        AssertEndGameScreenContains(game, 'Commoners');
        AssertEndGameScreenContains(game, 'won');
    });

    it('should end the game when there are no more wolves, with guard', () => {
        let game = mount(<Game />);

        goToNightGuardPhaseScreen(game);
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Guard Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmWolvesKill(game);

        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'Alberto', 'Claudio', 'SAW', 'Doctor', 'Bonny']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'SAW', 'change');
        ClickConfirmCommonersKill(game);

        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Claudio', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Claudio', 'change');
        ClickConfirmWolvesKill(game);

        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(game.find('EndGame'));
        AssertEndGameScreenContains(game, 'Commoners');
        AssertEndGameScreenContains(game, 'won');
    });

    it('should end the game when there are no more wolves, with whore', () => {
        let game = mount(<Game />);

        goToNightWhorePhaseScreen(game);
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Whore Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Alberto', 'change');
        ClickConfirmWolvesKill(game);

        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'Alberto', 'Claudio', 'SAW', 'Doctor', 'Bonny']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'SAW', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(game.find('EndGame'));
        AssertEndGameScreenContains(game, 'Commoners');
        AssertEndGameScreenContains(game, 'won');
    });

    it('should not let more than one player have the Guard role', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        let playerNamesScreen = goToPlayerNamesScreen(game, numberOfPlayers);

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-5'), 'Bonny', 'blur');
        changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-0'), 'Guard', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-1'), 'Guard', 'change');
        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'Only a player');
        AssertErrorScreenTextContains(game, 'guard');
    });

    it('should not let more than one player have the Whore role', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 6;

        let playerNamesScreen = goToPlayerNamesScreen(game, numberOfPlayers);

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
        changeElementSettingState(playerNamesScreen.find('#name-5'), 'Bonny', 'blur');
        changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-0'), 'Whore', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-1'), 'Whore', 'change');
        playerNamesScreen.find('.confirm-players-button').simulate('click');

        AssertElementIsVisible(game.find('ErrorScreen'));
        AssertErrorScreenTextContains(game, 'Only a player');
        AssertErrorScreenTextContains(game, 'whore');
    });

    it('guard should protect from wolves kill', () => {
        let game = mount(<Game />);
        goToNightGuardPhaseScreen(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Guard Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(getDayPhaseScreen(game));
        AssertDayPhaseScreenContains(game, 'Nobody died');
        AssertArrayContains(game.state('alivePlayers'), ['Manuel']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Guard Alberto');
    });

    it('should kill both whore and victim if whore is sleeping with victim', () => {
        let game = mount(<Game />);
        goToNightWhorePhaseScreen(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Whore Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(getDayPhaseScreen(game));
        AssertDayPhaseScreenContains(game, 'died');
        AssertDayPhaseScreenContains(game, 'Manuel');
        AssertDayPhaseScreenContains(game, 'Alberto');
        AssertArrayNotContains(game.state('alivePlayers'), ['Manuel', 'Alberto']);
        AssertArrayContains(game.state('alivePlayers'), ['SAW', 'Claudio', 'Doctor', 'Bonny']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
    });

    it('should kill whore if she sleeps with a wolf', () => {
        let game = mount(<Game />);
        goToNightWhorePhaseScreen(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Whore Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'SAW', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(getDayPhaseScreen(game));
        AssertDayPhaseScreenContains(game, 'died');
        AssertDayPhaseScreenContains(game, 'Manuel');
        AssertDayPhaseScreenContains(game, 'Alberto');
        AssertArrayNotContains(game.state('alivePlayers'), ['Manuel', 'Alberto']);
        AssertArrayContains(game.state('alivePlayers'), ['SAW', 'Claudio', 'Doctor', 'Bonny']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
    });

    it('nobody should die if whore and guard go to victim', () => {
        let game = mount(<Game />);
        goToNightGuardPhaseScreen_WithWhore(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Guard Bonny');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Whore Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Manuel', 'change');
        ClickConfirmWolvesKill(game);

        AssertElementIsVisible(getDayPhaseScreen(game));
        AssertDayPhaseScreenContains(game, 'Nobody died');
        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'Alberto', 'Michael', 'SAW', 'Claudio', 'Doctor', 'Bonny']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
    });

    it('should not let guard and whore act if they are dead', () => {
        let game = mount(<Game />);
        goToNightGuardPhaseScreen_WithWhore(game);

        AssertSpecialCharacterNightPhaseScreenContains(game, 'Guard Bonny');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Alberto', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        AssertSpecialCharacterNightPhaseScreenContains(game, 'Whore Alberto');
        changeElementSettingState(getNightSpecialCharacterScreen(game).find('select'), 'Bonny', 'change');
        ClickConfirmSpecialCharacterChoice(game);

        changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Bonny', 'change');
        ClickConfirmWolvesKill(game);

        AssertArrayContains(game.state('alivePlayers'), ['Manuel', 'Michael', 'SAW', 'Claudio', 'Doctor']);
        AssertArrayNotContains(game.state('alivePlayers'), ['Bonny', 'Alberto']);
        changeElementSettingState(getDayPhaseScreen(game).find('select'), 'Doctor', 'change');
        ClickConfirmCommonersKill(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Guard');
        AssertSpecialCharacterNightPhaseScreenContains(game, 'dead');
        AssertElementDoesNotExist(getNightSpecialCharacterScreen(game).find('select'));
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightSpecialCharacterScreen(game));
        AssertSpecialCharacterNightPhaseScreenContains(game, 'Whore');
        AssertSpecialCharacterNightPhaseScreenContains(game, 'dead');
        AssertElementDoesNotExist(getNightSpecialCharacterScreen(game).find('select'));
        ClickConfirmSpecialCharacterChoice(game);

        AssertElementIsVisible(getNightWolvesPhaseScreen(game));
    });
});

function AssertElementIsVisible(element) {
    expect(element.length).to.equal(1);
}

function AssertElementDoesNotExist(element) {
    expect(element.length).to.equal(0);
}

function goToPlayerNamesScreen(game, numberOfPlayers) {
    game.find('PlayerSelectionScreen').find('select').simulate('change', {target: {value: numberOfPlayers}});
    game.find('PlayerSelectionScreen').find('button').simulate('click');
    return game.find('PlayerNamesScreen');
}

function changeElementSettingState(elementWrapper, valueToInsert, eventToTrigger) {
    elementWrapper.instance().value = valueToInsert;
    elementWrapper.simulate(eventToTrigger);
}

function goToNightWolvesPhaseScreen(game) {
    let playerNamesScreen = goToPlayerNamesScreen(game, 6);

    AssertElementIsVisible(playerNamesScreen);

    changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-5'), 'Bonny', 'blur');
    changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
    changeElementSettingState(playerNamesScreen.find('#role-4'), 'Wolf', 'change');

    playerNamesScreen.find('.confirm-players-button').simulate('click');

    AssertElementIsVisible(getNightWolvesPhaseScreen(game));
}

function goToNightGuardPhaseScreen(game) {
    let playerNamesScreen = goToPlayerNamesScreen(game, 6);

    changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-5'), 'Bonny', 'blur');
    changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
    changeElementSettingState(playerNamesScreen.find('#role-4'), 'Wolf', 'change');
    changeElementSettingState(playerNamesScreen.find('#role-3'), 'Guard', 'change');

    playerNamesScreen.find('.confirm-players-button').simulate('click');
}

function goToNightWhorePhaseScreen(game) {
    let playerNamesScreen = goToPlayerNamesScreen(game, 6);

    changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-5'), 'Bonny', 'blur');
    changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
    //changeElementSettingState(playerNamesScreen.find('#role-4'), 'Wolf', 'change');
    changeElementSettingState(playerNamesScreen.find('#role-3'), 'Whore', 'change');

    playerNamesScreen.find('.confirm-players-button').simulate('click');
}

function goToNightGuardPhaseScreen_WithWhore(game) {
    let playerNamesScreen = goToPlayerNamesScreen(game, 7);

    changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-2'), 'SAW', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-3'), 'Alberto', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-4'), 'Doctor', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-5'), 'Bonny', 'blur');
    changeElementSettingState(playerNamesScreen.find('#name-6'), 'Michael', 'blur');
    changeElementSettingState(playerNamesScreen.find('#role-2'), 'Wolf', 'change');
    changeElementSettingState(playerNamesScreen.find('#role-5'), 'Guard', 'change');
    changeElementSettingState(playerNamesScreen.find('#role-3'), 'Whore', 'change');

    playerNamesScreen.find('.confirm-players-button').simulate('click');
}

function goToFirstDayScreen(game) {
    goToNightWolvesPhaseScreen(game);
    AssertWolvesNightPhaseScreenContains(game, 'Wolves SAW, Doctor');
    changeElementSettingState(getNightWolvesPhaseScreen(game).find('select'), 'Claudio', 'change');
    ClickConfirmWolvesKill(game);
}

function getDayPhaseScreen(game) {
    return game.find('DayPhaseScreen');
}

function AssertArrayContains(actual, expected) {
    for (let i = 0; i < expected.length; i++)
        expect(actual).to.contain(expected[i]);
}

function AssertArrayNotContains(actual, expected) {
    for (let i = 0; i < expected.length; i++)
        expect(actual).to.not.contain(expected[i]);
}

function getNightWolvesPhaseScreen(game) {
    return game.find('NightWolvesPhaseScreen');
}

function getNightSpecialCharacterScreen(game) {
    return game.find('NightSpecialCharacterScreen');
}

function ClickConfirmCommonersKill(game) {
    getDayPhaseScreen(game).find('.btn .btn-primary').simulate('click');
}

function ClickConfirmSpecialCharacterChoice(game) {
    getNightSpecialCharacterScreen(game).find('button').simulate('click');
}

function ClickConfirmWolvesKill(game) {
    getNightWolvesPhaseScreen(game).find('.btn .btn-primary').simulate('click');
}

function AssertDayPhaseScreenContains(game, message) {
    expect(getDayPhaseScreen(game).find('div.col-xs-4').text()).to.contain(message);
}

function AssertEndGameScreenContains(game, message) {
    expect(game.find('EndGame').find('div').text()).to.contain(message);
}

function AssertErrorScreenTextContains(game, message) {
    expect(game.find('ErrorScreen').text()).to.contain(message);
}

function AssertWolvesNightPhaseScreenContains(game, message) {
    expect(getNightWolvesPhaseScreen(game).find('div.col-xs-4').text()).to.contain(message);
}

function AssertSpecialCharacterNightPhaseScreenContains(game, message) {
    expect(getNightSpecialCharacterScreen(game).find('div.col-xs-4').text()).to.contain(message);
}