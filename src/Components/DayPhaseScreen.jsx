import React, { Component } from 'react';

class DayPhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            alivePlayers: this.props.alivePlayers,
            commonersVictim: '',
            messageFirstPart: this.setMessageFirstPart(),
            messageSecondPart: this.setMessageSecondPart()
        };
    }

    getAlivePlayersSelect() {
        let alivePlayers = this.state.alivePlayers;

        let result =
            <select className="field text-select-width" onChange={this.props.confirmKillSelection}>
                <option key={"-1"} value="">--</option>
                {alivePlayers.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    setMessageFirstPart() {
        //console.log(`[DayPhaseScreen][setMessageFirstPart][this.props.wolvesKills]: ${this.props.wolvesKills}`);
        let numberOfVictims = this.props.wolvesKills === undefined ?
                                0 :
                                this.props.wolvesKills.length;

        //console.log(`[DayPhaseScreen][setMessageFirstPart][numberOfVictims]: ${numberOfVictims}`);

        if (numberOfVictims === 0)
            return 'Nobody';

        else if (numberOfVictims === 1)
            return `${this.props.wolvesKills[0]}`;

        else
            return this.props.wolvesKills.join(' and ');
    }

    setMessageSecondPart() {
        return this.props.wolvesKills === [] ?
            "But you're bad persons, so you have to lynch someone anyway!" :
            'But the show must go on! Discuss about who you think did it and pick someone to lynch!';
    }

    render() {
      return (
        <div className="col-xs-12 col-xs-offset-3">
            <div className="col-xs-4">
                <strong>{this.state.messageFirstPart}</strong> died! <br/>{this.state.messageSecondPart}
            </div>
            <div className="col-xs-5">
                {this.getAlivePlayersSelect()}
            </div>
            <div className="col-xs-2 col-xs-offset-2">
                <button className="col-xs-5 btn btn-primary top-margin"
                        onClick={this.props.handleCommonersChoice}>
                    Conferma
                </button>
            </div>
        </div>
      );
    }
}

export default DayPhaseScreen;
