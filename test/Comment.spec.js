import React from 'react';
import BackToSelectionButton from '../src/Components/BackToSelectionButton';
import PlayerSelectionScreen from '../src/Components/PlayerSelectionScreen';
import Game from '../src/Components/App';
import PlayerNamesScreen from '../src/Components/PlayerNamesScreen'
import ErrorScreen from "../src/Components/ErrorScreen";
import Header from "../src/Components/Header";
import GameStates from "../src/Components/GameStates";

describe('Header item', () => {
    const title = "A random title";
    let header = shallow(<Header title={title}/>);

    it ('should display correct message', () => {
        expect(header.text()).to.equal(title);
    });
});

describe('BackToSelection item', () => {
    let game = mount(<Game />);
    const backToSelection = shallow(<BackToSelectionButton goBackToSelection={game.instance().goBackToSelection}/>);

    it('should be a button item', () => {
        expect(backToSelection.type()).to.equal('button');
    });

    it('should go to previous phase', () => {
        game.instance().setState({
            currentPhaseIndex: 1,
            error: true,
            errorMessage: "Not empty"
        });

        backToSelection.simulate('click');

        expect(game.state('error')).to.be.false;
        expect(game.state('currentPhaseIndex')).to.equal(0);
        expect(game.state('errorMessage')).to.be.empty;
    });

});

describe('PlayerSelectionScreen item', () => {
    let game = mount(<Game />);
    let selection = game.find('PlayerSelectionScreen');

    it('should have a confirm button', () => {
        expect(selection.find('button').length).to.equal(1);
        expect(selection.find('button').props().className).to.contain('btn-primary');
    });

    it('should have minimum 4 players', () => {
        expect(selection.instance().buildOptions(-1)).to.equal(null);
        expect(selection.instance().buildOptions(3)).to.equal(null);
        expect(selection.instance().buildOptions(5).length).to.equal(5 - 3 + 1);
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
        expect(errorScreen.find('BackToSelectionButton').length).to.equal(1);
    });
});

describe('PlayerNamesScreen item', () => {
    const numberOfPlayers = 7;
    let playerNamesScreen = mount(<PlayerNamesScreen selectedNumberOfPlayers={numberOfPlayers} playerNames={[]}/>);

    it('should create as many inputs as characters selected', () => {
        expect(playerNamesScreen.find('input').length).to.equal(numberOfPlayers);
    });
});

describe('Game item', () => {
    it('should create as many inputs as characters selected', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 4;

        expect(game.find('PlayerSelectionScreen').find('option').first().props().value).to.equal(-1);
        expect(game.find('input').length).to.equal(0);

        goToPlayerNamesScreen(game, numberOfPlayers);

        expect(game.find('PlayerNamesScreen').length).to.equal(1);
        expect(game.find('ErrorScreen').length).to.equal(0);
        expect(game.find('input').length).to.equal(numberOfPlayers);
    });

    it('should validate roles considering number of players', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 4;

        goToPlayerNamesScreen(game, numberOfPlayers);
        let playerNamesScreen = game.find('PlayerNamesScreen');

        expect(game.state('playerRoles')[0]).to.equal('Popolano');

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'input');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'input');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'Alberto', 'input');
        changeElementSettingState(playerNamesScreen.find('#name-3'), 'SAW', 'input');

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        expect(game.find('ErrorScreen').length).to.equal(1);
        expect(game.find('ErrorScreen').text()).to.contain("almeno un lupo");

        game.find('ErrorScreen').find('BackToSelectionButton').simulate('click');
        expect(game.find('#name-0').text()).to.be.empty;

        changeElementSettingState(playerNamesScreen.find('#role-0'), 'Lupo', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-1'), 'Lupo', 'change');
        changeElementSettingState(playerNamesScreen.find('#role-2'), 'Lupo', 'change');

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        expect(game.find('ErrorScreen').length).to.equal(1);
        expect(game.find('ErrorScreen').text()).to.contain("troppi lupi");
    });

    it('should not accept any blank name fields', () => {
        let game = mount(<Game />);
        let numberOfPlayers = 4;

        goToPlayerNamesScreen(game, numberOfPlayers);
        let playerNamesScreen = game.find('PlayerNamesScreen');

        expect(game.find('#name-0').text()).to.be.empty;
        expect(game.find('#name-1').text()).to.be.empty;
        expect(game.find('#name-2').text()).to.be.empty;
        expect(game.find('#name-3').text()).to.be.empty;

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        expect(game.find('ErrorScreen').length).to.equal(1);
        expect(game.find('ErrorScreen').text()).to.contain("nome");

        game.find('ErrorScreen').find('BackToSelectionButton').simulate('click');
        expect(game.find('#name-0').text()).to.be.empty;

        changeElementSettingState(playerNamesScreen.find('#name-0'), 'Manuel', 'input');
        changeElementSettingState(playerNamesScreen.find('#name-1'), 'Claudio', 'input');
        changeElementSettingState(playerNamesScreen.find('#name-2'), 'Alberto', 'input');
        changeElementSettingState(playerNamesScreen.find('#role-0'), 'Lupo', 'change');

        playerNamesScreen.find('.confirm-players-button').simulate('click');

        expect(game.find('ErrorScreen').length).to.equal(1);
        expect(game.find('ErrorScreen').text()).to.contain("nome");
    });
});

function goToPlayerNamesScreen(game, numberOfPlayers) {
    game.find('PlayerSelectionScreen').find('select').simulate('change', {target: {value: numberOfPlayers}});
    game.find('PlayerSelectionScreen').find('button').simulate('click');
}

function changeElementSettingState(elementWrapper, valueToInsert, eventToTrigger) {
    elementWrapper.instance().value = valueToInsert;
    elementWrapper.simulate(eventToTrigger);
}