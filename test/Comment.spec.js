import React from 'react';
import BackToSelectionButton from '../src/Components/BackToSelectionButton';
import PlayerSelectionScreen from '../src/Components/PlayerSelectionScreen';
import Game from '../src/Components/App';
import PlayerNamesScreen from '../src/Components/PlayerNamesScreen'
import ErrorScreen from "../src/Components/ErrorScreen";
import Header from "../src/Components/Header";

let game = mount(<Game />);

describe('Header item', () => {
    const title = "A random title";
    let header = shallow(<Header title={title}/>);

    it ('should display correct message', () => {
        expect(header.text()).to.equal(title);
    });
});

describe('BackToSelection item', () => {
    const backToSelection = shallow(<BackToSelectionButton goBackToSelection={game.instance().goBackToSelection}/>);

    it('should be a button item', () => {
        expect(backToSelection.type()).to.equal('button');
    });

    it('should reset state', () => {
        game.instance().setState({
            confirmedSelection: true,
            error: true,
            errorMessage: "Not empty"
        });

    backToSelection.simulate('click');

    expect(game.state('error')).to.be.false;
    expect(game.state('confirmedSelection')).to.be.false;
    expect(game.state('errorMessage')).to.be.empty;
  });
});

describe('PlayerSelectionScreen item', () => {
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

    game.instance().setState({
        selectedNumberOfPlayers: 6
    });

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
    let playerNamesScreen = shallow(<PlayerNamesScreen selectedNumberOfPlayers={numberOfPlayers}/>);

    it('should create as many inputs as characters selected', () => {
        expect(playerNamesScreen.find('input').length).to.equal(numberOfPlayers);
    });
});

describe('Game item', () => {
    it('should create as many inputs as characters selected', () => {
        expect(game.find('PlayerSelectionScreen').find('option').first().props().value).to.equal(-1);
        expect(game.find('input').length).to.equal(0);

        game.find('PlayerSelectionScreen').find('select').simulate('change', {target: { value : 4}});

        game.find('PlayerSelectionScreen').find('button').simulate('click');

        game.update();

        expect(game.find('PlayerNamesScreen').length).to.equal(1);
        expect(game.find('ErrorScreen').length).to.equal(0);
    });
});
